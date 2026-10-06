import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";
import { PackageSearch, PlusCircle, Trash2, AlertCircle, ShoppingCart } from "lucide-react-native";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { NewOrderFormData } from "../../schema/order-schema";
import { useOfflineOrderStore } from "@/store/seOfflineOrderStore";
import { productCartStyles as styles } from "../../style/order-style"; // Adjust path if needed

export default function OrderProductCart({ data }: { data: any }) {
    const { control, setValue } = useFormContext<NewOrderFormData>();
    const { offlineQueue } = useOfflineOrderStore();

    // Watch the global items array
    const cartItems = useWatch({ control, name: "items" }) || [];

    const getPendingDeduction = (productId: string) => {
        return offlineQueue.reduce((totalDeduction, offlineOrder) => {
            const itemInOrder = offlineOrder.rawPayload?.items?.find(
                (item: any) => item.productId === productId
            );
            return totalDeduction + (itemInOrder ? itemInOrder.quantity : 0);
        }, 0);
    };

    const derivedProductOptions = (data?.productOptions || []).map((p: any) => {
        const pending = getPendingDeduction(p.id);
        return { ...p, stock: p.stock - pending };
    });

    // Local state for the temporary selection before adding to cart
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [quantityText, setQuantityText] = useState<string>("1");
    const [errorMsg, setErrorMsg] = useState<string>("");

    // Get the full details of the currently selected product (now using derived options)
    const selectedProduct = selectedProductId
        ? derivedProductOptions.find((p: any) => p.id === selectedProductId)
        : null;

    // Live Math for the UI (Calculates as they type)
    const requestedQty = parseFloat(quantityText) || 0;
    const existingItemIndex = selectedProduct ? cartItems.findIndex((item) => item.productId === selectedProduct.id) : -1;
    const existingQty = existingItemIndex >= 0 ? cartItems[existingItemIndex].quantity : 0;
    
    // Remaining = Total Available - What's already in the cart - What they are typing right now
    const liveRemainingStock = selectedProduct ? selectedProduct.stock - existingQty - requestedQty : 0;

    const handleAddToCart = () => {
        setErrorMsg("");

        if (!selectedProduct) return;

        if (isNaN(requestedQty) || requestedQty <= 0) {
            setErrorMsg("Please enter a valid quantity.");
            return;
        }

        // Validate using our live math
        if (liveRemainingStock < 0) {
            setErrorMsg(`Cannot exceed available stock (${selectedProduct.stock}). You already have ${existingQty} in cart.`);
            return;
        }

        // Build the new item payload
        const totalRequested = existingQty + requestedQty;
        const newItem = {
            productId: selectedProduct.id,
            name: selectedProduct.label,
            price: selectedProduct.price,
            quantity: totalRequested,
        };

        let updatedCart;
        if (existingItemIndex >= 0) {
            // Update existing item
            updatedCart = [...cartItems];
            updatedCart[existingItemIndex] = newItem;
        } else {
            updatedCart = [...cartItems, newItem];
        }
        
        setValue("items", updatedCart, { shouldValidate: true });
        setSelectedProductId("");
        setQuantityText("1");
        Keyboard.dismiss();
    };

    const handleRemoveItem = (productId: string) => {
        const updatedCart = cartItems.filter((item) => item.productId !== productId);
        setValue("items", updatedCart, { shouldValidate: true });
    };

    return (
        <View style={styles.container}>
            {/* ADD PRODUCT BLOCK */}
            <View style={[styles.cardBase, styles.addProductCard]}>
                <View style={styles.headerRow}>
                    <PackageSearch size={16} color="#4922dd" />
                    <Text style={styles.headerText}>Add Products</Text>
                </View>

                <SearchableSelect
                    label="Select Product"
                    placeholder="Search inventory..."
                    options={derivedProductOptions}
                    selectedValue={selectedProductId}
                    onSelect={(id) => {
                        setSelectedProductId(id);
                        setErrorMsg("");
                        setQuantityText("1");
                    }}
                />

                {/* Dynamic Stock & Price Info */}
                {selectedProduct && (
                    <View style={styles.stockInfoBox}>
                        <View>
                            <Text style={styles.stockLabel}>Sale Price</Text>
                            <Text style={styles.priceValue}>Rs. {selectedProduct.price}</Text>
                        </View>
                        <View style={styles.stockRightBlock}>
                            <Text style={styles.stockLabel}>Remaining Stock</Text>
                            <Text style={[
                                styles.stockValueBase,
                                liveRemainingStock >= 0 ? styles.stockGood : styles.stockBad
                            ]}>
                                {liveRemainingStock} ({selectedProduct.unit.toLowerCase()})
                            </Text>
                        </View>
                    </View>
                )}

                {/* Decimal Quantity Input */}
                <View style={styles.inputRow}>
                    <View style={styles.qtyInputBlock}>
                        <Text style={styles.qtyLabel}>Quantity</Text>
                        <TextInput
                            value={quantityText}
                            onChangeText={(text) => {
                                setQuantityText(text);
                                setErrorMsg("");
                            }}
                            keyboardType="decimal-pad"
                            placeholder="0.0"
                            editable={!!selectedProduct}
                            style={[
                                styles.qtyInputBase,
                                !selectedProduct
                                    ? styles.qtyInputDisabled
                                    : (errorMsg || liveRemainingStock < 0)
                                        ? styles.qtyInputError
                                        : styles.qtyInputNormal
                            ]}
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    <View style={styles.addBtnBlock}>
                        <TouchableOpacity
                            onPress={handleAddToCart}
                            disabled={!selectedProduct || liveRemainingStock < 0 || selectedProduct.stock <= 0}
                            style={[
                                styles.addBtnBase,
                                (selectedProduct && liveRemainingStock >= 0 && selectedProduct.stock > 0)
                                    ? styles.addBtnActive
                                    : styles.addBtnInactive
                            ]}
                        >
                            <PlusCircle 
                                size={16} 
                                color={(selectedProduct && liveRemainingStock >= 0 && selectedProduct.stock > 0) ? "#ffffff" : "#94a3b8"} 
                            />
                            <Text style={[
                                styles.addBtnTextBase,
                                (selectedProduct && liveRemainingStock >= 0 && selectedProduct.stock > 0)
                                    ? styles.addBtnTextActive
                                    : styles.addBtnTextInactive
                            ]}>
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Error Message */}
                {errorMsg ? (
                    <View style={styles.errorBox}>
                        <AlertCircle size={14} color="#e11d48" />
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                ) : null}
            </View>

            {/* ACTIVE CART ITEMS BLOCK */}
            {cartItems.length > 0 && (
                <View style={[styles.cardBase, styles.cartListCard]}>
                    <View style={styles.headerRow}>
                        <ShoppingCart size={16} color="#d42b7c" />
                        <Text style={styles.headerText}>Current Order</Text>
                    </View>

                    <View style={styles.cartListContainer}>
                        {cartItems.map((item, index) => (
                            <View key={`${item.productId}-${index}`} style={styles.cartItemRow}>
                                <View style={styles.cartItemInfo}>
                                    <Text style={styles.cartItemName} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.cartItemSub}>
                                        {item.quantity} x Rs. {item.price}
                                    </Text>
                                </View>

                                <View style={styles.cartItemRight}>
                                    <Text style={styles.cartItemTotal}>
                                        Rs. {item.quantity * item.price}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveItem(item.productId)}
                                        style={styles.deleteBtn}
                                        activeOpacity={0.7}
                                    >
                                        <Trash2 size={16} color="#e11d48" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}