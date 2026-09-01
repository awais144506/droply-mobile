import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ArrowLeft, Minus, Plus, CheckCircle2, UserPlus, CalendarDays, PackageSearch } from "lucide-react-native";
import SearchableSelect from "@/components/ui/SearchableSelect";

// --- MOCK DATABASE ---
const MOCK_ZONES = [
  { id: "z1", label: "Farid Town" },
  { id: "z2", label: "Fateh Sher Colony" },
  { id: "z3", label: "Tariq Bin Ziad" },
  { id: "z4", label: "High Street" },
];

const MOCK_CUSTOMERS_BY_ZONE: Record<string, { id: string; label: string }[]> = {
  z1: [{ id: "c1", label: "Tariq Mahmood (H#14)" }, { id: "c2", label: "Al-Madina Sweets" }],
  z2: [{ id: "c4", label: "Dr. Shahida Parveen" }],
  z3: [],
  z4: [{ id: "c5", label: "Muhammad Bilal (Shop 4)" }],
};

const MOCK_PRODUCTS = [
  { id: "p1", label: "19L Normal Bottle (Refill)" },
  { id: "p2", label: "1.5L PET Water (Carton of 6)" },
  { id: "p3", label: "500ml PET Water (Carton of 12)" },
  { id: "p4", label: "New 19L Bottle (With Water)" },
  { id: "p5", label: "Water Dispenser (Hot & Cold)" },
];

type ScheduleMode = "TODAY" | "TOMORROW" | "LATER";

export default function NewOrderScreen() {
  const router = useRouter();

  // Customer State
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Product State
  const [selectedProductId, setSelectedProductId] = useState<string | null>("p1"); // Default to main product
  const [quantityRequested, setQuantityRequested] = useState(1);
  
  // Scheduling State
  const [schedule, setSchedule] = useState<ScheduleMode>("TODAY");
  
  const dayAfterTomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }, []);

  const [customDate, setCustomDate] = useState<Date>(dayAfterTomorrow);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const availableCustomers = useMemo(() => {
    if (!selectedZoneId) return [];
    return MOCK_CUSTOMERS_BY_ZONE[selectedZoneId] || [];
  }, [selectedZoneId]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setCustomDate(selectedDate);
      setSchedule("LATER");
    }
  };

  const handleGenerateOrder = () => {
    if (!selectedCustomerId) {
      Alert.alert("Missing Info", "Please select a customer.");
      return;
    }
    if (!selectedProductId) {
      Alert.alert("Missing Info", "Please select a product.");
      return;
    }

    const productName = MOCK_PRODUCTS.find(p => p.id === selectedProductId)?.label;
    
    let scheduleText = schedule;
    if (schedule === "LATER") {
      scheduleText = customDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    }

    Alert.alert(
      "Generate Order",
      `Customer Name: ${selectedCustomerId}\nProduct: ${productName}\nQuantity: ${quantityRequested}\nScheduled for: ${scheduleText}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => router.back() },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">

        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <TouchableOpacity onPress={() => router.back()} className="h-9 w-9 bg-slate-100 rounded-xl items-center justify-center">
            <ArrowLeft size={18} color="#334155" />
          </TouchableOpacity>
          <Text className="text-sm font-bold text-slate-900">Generate Order</Text>
          <View className="w-9" />
        </View>

        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity
            onPress={() => router.push("/sale/new-customer")}
            className="mb-4 flex-row items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 rounded-xl active:bg-slate-100"
          >
            <UserPlus size={16} color="#0284c7" />
            <Text className="text-xs font-bold text-sky-700">Add New Customer</Text>
          </TouchableOpacity>

          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 shadow-sm">
            <SearchableSelect
              label="Select Zone"
              placeholder="Search zones..."
              options={MOCK_ZONES}
              selectedValue={selectedZoneId}
              onSelect={(id) => {
                setSelectedZoneId(id);
                setSelectedCustomerId(null);
              }}
            />

            <SearchableSelect
              label="Select Customer"
              placeholder={selectedZoneId ? "Search customers..." : "Select a zone first"}
              options={availableCustomers}
              selectedValue={selectedCustomerId}
              onSelect={setSelectedCustomerId}
              disabled={!selectedZoneId}
            />
          </View>

          {/* Dynamic Product Selection */}
          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 shadow-sm">
            <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3 flex-row items-center">
              Order Requirements
            </Text>
            
            <SearchableSelect
              label="Select Product"
              placeholder="Search products..."
              options={MOCK_PRODUCTS}
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
                    {selectedProductId ? MOCK_PRODUCTS.find(p => p.id === selectedProductId)?.label : "Select a product above"}
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
          </View>

          {/* Scheduling Block */}
          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm">
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
    </SafeAreaView>
  );
}