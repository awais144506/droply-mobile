/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ShoppingCart, Minus, Plus, CheckCircle2, UserPlus, CalendarDays, PackageSearch, PlusCircle, Trash2 } from "lucide-react-native";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { CustomAlert, CustomAlertProps } from "@/components/ui/CustomAlert";
import { useUser } from "@clerk/clerk-expo";
import { useRiderOrderData } from "@/features/orders/api/use-order";

type ScheduleMode = "TODAY" | "TOMORROW" | "LATER";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
}

export default function NewOrderScreen() {
  const router = useRouter();
  const { user } = useUser();
  const branchId = user?.publicMetadata?.branchId as string | undefined;
  const { data, isLoading, refetch, isRefetching } = useRiderOrderData(branchId);

  const zoneOptions = data?.zoneOptions || [];
  const allCustomers = data?.customerOptions || [];
  const productOptions = data?.productOptions || [];

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantityRequested, setQuantityRequested] = useState(1);

  const [schedule, setSchedule] = useState<ScheduleMode>("TODAY");

  const [alertConfig, setAlertConfig] = useState<CustomAlertProps>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const showAlert = (config: Omit<CustomAlertProps, "visible">) => {
    setAlertConfig({ ...config, visible: true });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const dayAfterTomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }, []);

  const [customDate, setCustomDate] = useState<Date>(dayAfterTomorrow);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter customers based on the selected zone
  const availableCustomers = useMemo(() => {
    if (!selectedZoneId) return [];
    return allCustomers.filter(customer => customer.zoneId === selectedZoneId);
  }, [selectedZoneId, allCustomers]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setCustomDate(selectedDate);
      setSchedule("LATER");
    }
  };


  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const product = productOptions.find(p => p.id === selectedProductId);
    if (!product) return;

    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === selectedProductId);
      if (existingItem) {
        return prev.map(item =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + quantityRequested }
            : item
        );
      }
      return [...prev, { productId: selectedProductId, name: product.label, quantity: quantityRequested }];
    });

    // Reset temporary selections
    setSelectedProductId(null);
    setQuantityRequested(1);
  };

  // 🔥 Handle removing an item from the cart
  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleGenerateOrder = () => {
    if (!selectedZoneId) {
      showAlert({ title: "Missing Zone", message: "Please select a zone first.", onConfirm: closeAlert });
      return;
    }
    if (!selectedCustomerId) {
      showAlert({ title: "Missing Customer", message: "Please select a customer.", onConfirm: closeAlert });
      return;
    }
    if (cartItems.length === 0) {
      showAlert({ title: "Empty Order", message: "Please add at least one product to the order.", onConfirm: closeAlert });
      return;
    }

    const customerName = allCustomers.find(c => c.id === selectedCustomerId)?.label;

    let scheduleText = String(schedule);
    if (schedule === "LATER") {
      scheduleText = customDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    }

    const productsListText = cartItems.map(item => `• ${item.quantity}x ${item.name}`).join('\n');

    showAlert({
      title: "Confirm Order Details",
      message: `Customer: ${customerName}\nScheduled for: ${scheduleText}\n\nItems:\n${productsListText}`,
      confirmText: "Generate Order",
      cancelText: "Cancel",
      onCancel: closeAlert,
      onConfirm: () => {
        closeAlert();
        // Fire mutation here in the future
        router.back();
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">

        <View className="px-4 py-3 bg-white border-b border-slate-200">
          <View className="flex-row items-center gap-2">
            <View className="h-9 w-9 rounded-xl bg-sky-50 items-center justify-center border border-sky-100">
              <ShoppingCart size={25} color="#0284c7" />
            </View>
            <Text className="text-lg font-bold text-slate-900">Create Order</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#0284c7"]}
              tintColor="#0284c7"
            />
          }
        >
          <TouchableOpacity
            onPress={() => router.push("/sale/new-customer")}
            className="mb-4 flex-row items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 rounded-xl active:bg-slate-100"
          >
            <UserPlus size={16} color="#0284c7" />
            <Text className="text-xs font-bold text-sky-700">Add New Customer</Text>
          </TouchableOpacity>

          {/* Location & Customer Block */}
          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 shadow-sm">
            <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3">Delivery Destination</Text>

            {isLoading ? (
              <View className="py-6 items-center justify-center">
                <ActivityIndicator size="small" color="#0284c7" />
                <Text className="text-xs text-slate-400 mt-2">Loading data...</Text>
              </View>
            ) : (
              <View className="gap-3">
                <SearchableSelect
                  label="Select Zone"
                  placeholder="Tap to select zone..."
                  options={zoneOptions}
                  selectedValue={selectedZoneId}
                  onSelect={(id) => {
                    setSelectedZoneId(id);
                    setSelectedCustomerId(null);
                  }}
                />

                <View className={`${!selectedZoneId ? 'opacity-50' : ''}`}>
                  <SearchableSelect
                    label="Select Customer"
                    placeholder={selectedZoneId ? "Tap to select customer..." : "Please select a zone first"}
                    options={availableCustomers}
                    selectedValue={selectedCustomerId}
                    onSelect={setSelectedCustomerId}
                    disabled={!selectedZoneId}
                  />
                  {selectedZoneId && availableCustomers.length === 0 && (
                    <Text className="text-[10px] text-rose-500 mt-1 ml-1">No customers found in this zone.</Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* 🔥 Multi-Item Product Selection Block */}
          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 shadow-sm z-50">
            <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3">Add Products</Text>

            <SearchableSelect
              label="Select Product"
              placeholder="Search branch products..."
              options={productOptions}
              selectedValue={selectedProductId}
              onSelect={setSelectedProductId}
            />

            <View className="flex-row items-center justify-between mt-2 pt-4 border-t border-slate-100">
              <View className="flex-row items-center gap-2 flex-1 pr-3">
                <View className="h-8 w-8 rounded-lg bg-sky-50 items-center justify-center border border-sky-100">
                  <PackageSearch size={16} color="#0284c7" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-800">Quantity</Text>
                  <Text className="text-[10px] text-slate-500" numberOfLines={1}>
                    {selectedProductId ? productOptions.find(p => p.id === selectedProductId)?.label : "Select a product above"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <TouchableOpacity onPress={() => setQuantityRequested((prev) => Math.max(1, prev - 1))} className="h-8 w-8 bg-white rounded-lg items-center justify-center border border-slate-200">
                  <Minus size={16} color="#0f172a" />
                </TouchableOpacity>
                <Text className="w-8 text-center text-lg font-bold text-slate-900">{quantityRequested}</Text>
                <TouchableOpacity onPress={() => setQuantityRequested((prev) => prev + 1)} className="h-8 w-8 bg-white rounded-lg items-center justify-center border border-slate-200">
                  <Plus size={16} color="#0f172a" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={!selectedProductId}
              className={`mt-4 py-3 rounded-xl flex-row items-center justify-center gap-2 ${selectedProductId ? "bg-slate-800 active:bg-slate-900" : "bg-slate-100 opacity-70"
                }`}
            >
              <PlusCircle size={16} color={selectedProductId ? "#ffffff" : "#94a3b8"} />
              <Text className={`text-sm font-bold ${selectedProductId ? "text-white" : "text-slate-400"}`}>
                Add to Order
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🔥 Added Items Cart Summary */}
          {cartItems.length > 0 && (
            <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 shadow-sm z-0">
              <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3">Order Summary</Text>
              <View className="gap-2">
                {cartItems.map((item) => (
                  <View key={item.productId} className="flex-row items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <View className="flex-1 pr-3">
                      <Text className="text-sm font-bold text-slate-800" numberOfLines={1}>{item.name}</Text>
                      <Text className="text-xs font-semibold text-sky-600 mt-0.5">Qty: {item.quantity}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.productId)}
                      className="h-8 w-8 bg-rose-50 rounded-lg items-center justify-center border border-rose-100"
                    >
                      <Trash2 size={16} color="#e11d48" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Scheduling Block */}
          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm z-0">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <CalendarDays size={16} color="#64748b" />
                <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Delivery Schedule</Text>
              </View>

              {Platform.OS === "ios" && showDatePicker && (
                <DateTimePicker value={customDate} mode="date" display="compact" minimumDate={dayAfterTomorrow} onChange={handleDateChange} />
              )}
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity onPress={() => { setSchedule("TODAY"); setShowDatePicker(false); }} className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${schedule === "TODAY" ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"}`}>
                <Text className={`text-xs font-bold ${schedule === "TODAY" ? "text-sky-700" : "text-slate-600"}`}>Today</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSchedule("TOMORROW"); setShowDatePicker(false); }} className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${schedule === "TOMORROW" ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"}`}>
                <Text className={`text-xs font-bold ${schedule === "TOMORROW" ? "text-sky-700" : "text-slate-600"}`}>Tomorrow</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSchedule("LATER"); setShowDatePicker(true); }} className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${schedule === "LATER" ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200"}`}>
                <Text className={`text-xs font-bold ${schedule === "LATER" ? "text-sky-700" : "text-slate-600"}`}>
                  {schedule === "LATER" ? customDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Pick Date"}
                </Text>
              </TouchableOpacity>
            </View>

            {Platform.OS === "android" && showDatePicker && (
              <DateTimePicker value={customDate} mode="date" display="default" minimumDate={dayAfterTomorrow} onChange={handleDateChange} />
            )}
          </View>
        </ScrollView>

        <View className="p-4 bg-white border-t border-slate-200">
          <TouchableOpacity onPress={handleGenerateOrder} className="w-full h-12 bg-sky-600 rounded-xl items-center justify-center flex-row gap-2 active:bg-sky-700 shadow-sm">
            <CheckCircle2 size={18} color="#ffffff" />
            <Text className="text-white text-sm font-bold">Generate Order</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Render the Custom Alert outside the KeyboardAvoidingView */}
      <CustomAlert {...alertConfig} />
    </SafeAreaView>
  );
}