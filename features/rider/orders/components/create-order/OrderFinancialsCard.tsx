import React from "react";
import { View, Text, TextInput } from "react-native";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Receipt, Tag, Truck, Banknote } from "lucide-react-native";
import { NewOrderFormData } from "../../schema/order-schema";
import { financialsCardStyles as styles } from "../../style/order-style"; // Adjust path if needed

export default function OrderFinancialsCard({ data }: { data: any }) {
  const { control } = useFormContext<NewOrderFormData>();

  // Watch the values needed for real-time math
  const items = useWatch({ control, name: "items" }) || [];
  const discountAmount = useWatch({ control, name: "discountAmount" }) || 0;
  const deliveryCharges = useWatch({ control, name: "deliveryCharges" }) || 0;
  const customerId = useWatch({ control, name: "customerId" });

  // Hide the financials completely if the cart is empty to keep the UI clean
  if (items.length === 0) return null;

  // 1. Calculate the subtotal of the cart
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 2. Calculate the current order's final price
  const currentOrderTotal = Math.max(0, subtotal + Number(deliveryCharges) - Number(discountAmount));

  // 3. Find if the customer owes money from previous orders
  const selectedCustomer = data?.allCustomers?.find((c: any) => c.id === customerId);
  const previousDebt = selectedCustomer?.customerCredit || 0;

  // 4. Calculate the grand total the rider needs to physically collect
  const amountToCollect = currentOrderTotal + (previousDebt > 0 ? previousDebt : 0);

  return (
    <View style={styles.cardBase}>
      <View style={styles.headerRow}>
        <Receipt size={16} color="#64748b" />
        <Text style={styles.headerText}>Financial Summary</Text>
      </View>

      <View style={styles.rowsContainer}>

        {/* Subtotal Row */}
        <View style={styles.standardRow}>
          <Text style={styles.subtotalLabel}>Cart Subtotal</Text>
          <Text style={styles.subtotalValue}>Rs. {subtotal}</Text>
        </View>

        {/* Delivery Charges Input */}
        <View style={styles.inputRow}>
          <View style={styles.labelGroup}>
            <Truck size={14} color="#64748b" />
            <Text style={styles.inputLabel}>Delivery</Text>
          </View>
          <Controller
            control={control}
            name="deliveryCharges"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputPrefix}>Rs.</Text>
                <TextInput
                  keyboardType="number-pad"
                  value={value === 0 ? "" : String(value)}
                  onChangeText={(text) => onChange(text ? parseInt(text, 10) : 0)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  style={styles.inputField}
                />
              </View>
            )}
          />
        </View>

        {/* Discount Input */}
        <View style={styles.inputRow}>
          <View style={styles.labelGroup}>
            <Tag size={14} color="#64748b" />
            <Text style={styles.inputLabel}>Discount</Text>
          </View>
          <Controller
            control={control}
            name="discountAmount"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputPrefix}>- Rs.</Text>
                <TextInput
                  keyboardType="number-pad"
                  value={value === 0 ? "" : String(value)}
                  onChangeText={(text) => onChange(text ? parseInt(text, 10) : 0)}
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  style={styles.inputField}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.divider} />

        {/* Current Order Total */}
        <View style={styles.standardRow}>
          <Text style={styles.currentOrderLabel}>Current Order</Text>
          <Text style={styles.currentOrderValue}>Rs. {currentOrderTotal}</Text>
        </View>

        {/* Previous Debt (Only shows if they owe money) */}
        {previousDebt > 0 && (
          <View style={styles.standardRow}>
            <Text style={styles.debtLabel}>Previous Outstanding</Text>
            <Text style={styles.debtValue}>+ Rs. {previousDebt}</Text>
          </View>
        )}

      </View>

      {/* GRAND TOTAL COLLECTABLE BLOCK */}
      <View style={styles.grandTotalBox}>
        <View style={styles.grandTotalLeft}>
          <View style={styles.grandTotalIconWrapper}>
            <Banknote size={16} color="#0369a1" />
          </View>
          <View>
            <Text style={styles.grandTotalLabel}>Amount to Collect</Text>
            <Text style={styles.grandTotalSub}>Order + Debt</Text>
          </View>
        </View>
        <Text style={styles.grandTotalValue}>
          Rs. {amountToCollect}
        </Text>
      </View>

    </View>
  );
}