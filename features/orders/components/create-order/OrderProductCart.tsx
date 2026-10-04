import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";
import { PackageSearch, PlusCircle, Trash2, AlertCircle, ShoppingCart } from "lucide-react-native";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { NewOrderFormData } from "../../schema/order-schema";
import { useOfflineOrderStore } from "@/store/seOfflineOrderStore";

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

    // 🔥 3. Live Math for the UI (Calculates as they type)
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
        <View className="mb-4">
            {/* ADD PRODUCT BLOCK */}
            <View className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm z-50">
                <View className="flex-row items-center gap-2 mb-4">
                    <PackageSearch size={16} color="#4922dd" />
                    <Text className="text-[11px] text-slate-800 font-bold uppercase tracking-wider">Add Products</Text>
                </View>

                <SearchableSelect
                    label="Select Product"
                    placeholder="Search inventory..."
                    options={derivedProductOptions} // 🔥 Pass the derived options here
                    selectedValue={selectedProductId}
                    onSelect={(id) => {
                        setSelectedProductId(id);
                        setErrorMsg("");
                        setQuantityText("1");
                    }}
                />

                {/* Dynamic Stock & Price Info */}
                {selectedProduct && (
                    <View className="mt-3 flex-row items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <View>
                            <Text className="text-[10px] font-bold text-slate-400 uppercase">Sale Price</Text>
                            <Text className="text-sm font-extrabold text-slate-800">Rs. {selectedProduct.price}</Text>
                        </View>
                        <View className="items-end">
                            {/* 🔥 Live Remaining Stock UI */}
                            <Text className="text-[10px] font-bold text-slate-400 uppercase">Remaining Stock</Text>
                            <Text className={`text-sm font-extrabold ${liveRemainingStock >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                {liveRemainingStock} ({selectedProduct.unit.toLowerCase()})
                            </Text>
                        </View>
                    </View>
                )}

                {/* Decimal Quantity Input */}
                <View className="mt-4 flex-row gap-3">
                    <View className="flex-1 justify-center">
                        <Text className="text-xs font-bold text-slate-700 mb-1.5 ml-1">Quantity</Text>
                        <TextInput
                            value={quantityText}
                            onChangeText={(text) => {
                                setQuantityText(text);
                                setErrorMsg("");
                            }}
                            keyboardType="decimal-pad"
                            placeholder="0.0"
                            editable={!!selectedProduct}
                            className={`h-12 bg-slate-50 border rounded-xl px-4 text-base font-bold text-slate-900 ${!selectedProduct ? "opacity-50 border-slate-200" : (errorMsg || liveRemainingStock < 0) ? "border-rose-400 bg-rose-50/50 text-rose-700" : "border-slate-200"
                                }`}
                        />
                    </View>

                    <View className="justify-end">
                        <TouchableOpacity
                            onPress={handleAddToCart}
                            disabled={!selectedProduct || liveRemainingStock < 0 || selectedProduct.stock <= 0}
                            className={`h-12 px-6 rounded-xl items-center justify-center flex-row gap-2 ${selectedProduct && liveRemainingStock >= 0 && selectedProduct.stock > 0
                                ? "bg-slate-900 active:bg-slate-800"
                                : "bg-slate-200"
                                }`}
                        >
                            <PlusCircle size={16} color={selectedProduct && liveRemainingStock >= 0 && selectedProduct.stock > 0 ? "#ffffff" : "#94a3b8"} />
                            <Text className={`text-sm font-bold ${selectedProduct && liveRemainingStock >= 0 && selectedProduct.stock > 0 ? "text-white" : "text-slate-400"}`}>
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Error Message */}
                {errorMsg ? (
                    <View className="flex-row items-center gap-1.5 mt-3 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                        <AlertCircle size={14} color="#e11d48" />
                        <Text className="text-xs font-semibold text-rose-600 flex-1">{errorMsg}</Text>
                    </View>
                ) : null}
            </View>

            {/* ACTIVE CART ITEMS BLOCK */}
            {cartItems.length > 0 && (
                <View className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm mt-4 z-0">
                    <View className="flex-row items-center gap-2 mb-4">
                        <ShoppingCart size={16} color="#d42b7c" />
                        <Text className="text-[11px] text-slate-800 font-bold uppercase tracking-wider">Current Order</Text>
                    </View>

                    <View className="gap-2.5">
                        {cartItems.map((item, index) => (
                            <View key={`${item.productId}-${index}`} className="flex-row items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                <View className="flex-1 pr-3">
                                    <Text className="text-sm font-bold text-slate-800" numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text className="text-xs font-semibold text-slate-500 mt-0.5">
                                        {item.quantity} x Rs. {item.price}
                                    </Text>
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <Text className="text-sm font-extrabold text-sky-700">
                                        Rs. {item.quantity * item.price}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveItem(item.productId)}
                                        className="h-9 w-9 bg-rose-50 rounded-xl items-center justify-center border border-rose-100 active:bg-rose-100"
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