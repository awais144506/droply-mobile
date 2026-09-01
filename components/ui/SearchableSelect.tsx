import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Search, ChevronDown, ChevronUp, Check, X } from "lucide-react-native";

export interface SelectOption {
  id: string;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  selectedValue: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function SearchableSelect({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const selectedOption = options.find((o) => o.id === selectedValue);

  return (
    <View className="mb-4 relative z-50">
      <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
        {label}
      </Text>
      
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.7}
        onPress={() => {
          setSearchQuery("");
          setIsOpen(!isOpen);
        }}
        className={`flex-row items-center justify-between bg-slate-50 border h-12 px-3 ${
          isOpen ? "rounded-t-xl border-slate-300 border-b-0" : "rounded-xl border-slate-200"
        } ${disabled ? "opacity-60 bg-slate-100" : ""}`}
      >
        <Text className={`text-sm font-semibold ${selectedOption ? "text-slate-900" : "text-slate-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        {isOpen ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#94a3b8" />}
      </TouchableOpacity>

      {isOpen && (
        <View className="bg-white border border-slate-300 border-t-0 rounded-b-xl overflow-hidden shadow-sm">
          <View className="p-2 border-b border-slate-100 bg-slate-50">
            <View className="flex-row items-center bg-white border border-slate-200 rounded-lg px-2 h-10">
              <Search size={14} color="#94a3b8" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                className="flex-1 ml-2 text-xs font-medium text-slate-900"
                placeholderTextColor="#94a3b8"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} className="p-1">
                  <X size={14} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ScrollView className="max-h-48" nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => {
                const isSelected = item.id === selectedValue;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      onSelect(item.id);
                      setIsOpen(false);
                    }}
                    className={`flex-row items-center justify-between px-4 py-3 border-b border-slate-50 ${isSelected ? "bg-sky-50/50" : "bg-white"}`}
                  >
                    <Text className={`text-xs ${isSelected ? "font-bold text-sky-700" : "font-medium text-slate-700"}`}>
                      {item.label}
                    </Text>
                    {isSelected && <Check size={16} color="#0284c7" />}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="py-6 items-center justify-center">
                <Text className="text-xs text-slate-400">No results found.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}