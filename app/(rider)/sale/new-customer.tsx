import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { ArrowLeft, User, Phone, MapPinned, Building2, RefreshCw, Send } from "lucide-react-native";

export default function AddNewCustomerScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  useEffect(() => {
    captureLocation();
  }, []);

  const captureLocation = async () => {
    setIsFetchingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "GPS is required to tag the customer's location for the owner.");
        setIsFetchingGps(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocationCoords({ lat: location.coords.latitude, lng: location.coords.longitude });
    } catch {
      Alert.alert("GPS Error", "Failed to fetch location. Please try again.");
    } finally {
      setIsFetchingGps(false);
    }
  };

  const handleSendToManager = () => {
    if (!name.trim() || !locationCoords) {
      Alert.alert("Missing Info", "Customer name and GPS location are required to submit the request.");
      return;
    }
    
    Alert.alert(
      "Send to Management",
      `Send new customer details for "${name}" directly to the plant manager for database approval?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Submit Request", 
          onPress: () => {
            Alert.alert("Success", "Customer request and GPS pin sent to plant owner for review.", [
              { text: "OK", onPress: () => router.back() }
            ]);
          } 
        },
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
          <Text className="text-sm font-bold text-slate-900">Request New Customer</Text>
          <View className="w-9" />
        </View>

        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          
          <View className="mb-4 bg-sky-50 border border-sky-200 p-3.5 rounded-2xl">
            <Text className="text-xs font-bold text-sky-900 mb-0.5">Manager Approval Required</Text>
            <Text className="text-[11px] text-sky-700 leading-relaxed">
              Riders cannot directly add accounts. Submitting this form will ping the plant manager with the customer details and exact GPS coordinates to register them into the system.
            </Text>
          </View>

          <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm">
            <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3">Customer Details</Text>

            <View className="space-y-3">
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-12">
                <User size={16} color="#64748b" />
                <TextInput value={name} onChangeText={setName} placeholder="Customer Name or Shop" placeholderTextColor="#94a3b8" className="flex-1 ml-2 text-sm font-semibold text-slate-900" />
              </View>

              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-12">
                <Phone size={16} color="#64748b" />
                <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Phone Number" placeholderTextColor="#94a3b8" className="flex-1 ml-2 text-sm font-semibold text-slate-900" />
              </View>

              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-12">
                <Building2 size={16} color="#64748b" />
                <TextInput value={address} onChangeText={setAddress} placeholder="Shop # / Area / Address" placeholderTextColor="#94a3b8" className="flex-1 ml-2 text-sm font-semibold text-slate-900" />
              </View>
            </View>

            <View className="mt-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 bg-emerald-100 rounded-full items-center justify-center">
                  <MapPinned size={20} color="#059669" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-emerald-800">Tagged GPS Location</Text>
                  {isFetchingGps ? (
                    <Text className="text-[10px] text-emerald-600">Acquiring GPS...</Text>
                  ) : locationCoords ? (
                    <Text className="text-[10px] text-emerald-600 font-mono">
                      {locationCoords.lat.toFixed(5)}, {locationCoords.lng.toFixed(5)}
                    </Text>
                  ) : (
                    <Text className="text-[10px] text-rose-600">Failed to capture</Text>
                  )}
                </View>
              </View>
              
              <TouchableOpacity onPress={captureLocation} disabled={isFetchingGps} className="p-2 bg-white rounded-full shadow-xs border border-emerald-100">
                {isFetchingGps ? <ActivityIndicator size="small" color="#059669" /> : <RefreshCw size={14} color="#059669" />}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View className="p-4 bg-white border-t border-slate-200">
          <TouchableOpacity onPress={handleSendToManager} className="w-full h-12 bg-sky-600 rounded-xl items-center justify-center flex-row gap-2 active:bg-sky-700 shadow-sm">
            <Send size={16} color="#ffffff" />
            <Text className="text-white text-sm font-bold">Send Request to Manager</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}