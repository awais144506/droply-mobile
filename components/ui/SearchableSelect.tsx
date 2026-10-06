import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Search, ChevronDown, ChevronUp, Check, X } from "lucide-react-native";
import { searchableSelectStyles as styles } from "../style/custom-style";

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
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>
      
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.7}
        onPress={() => {
          setSearchQuery("");
          setIsOpen(!isOpen);
        }}
        style={[
          styles.triggerBase,
          isOpen ? styles.triggerOpen : styles.triggerClosed,
          disabled && styles.triggerDisabled
        ]}
      >
        <Text style={[
          styles.triggerTextBase,
          selectedOption ? styles.triggerTextSelected : styles.triggerTextPlaceholder
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        {isOpen ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#94a3b8" />}
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownContainer}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Search size={14} color="#94a3b8" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                style={styles.searchInputText}
                placeholderTextColor="#94a3b8"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                  <X size={14} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* List Renderer - Using ScrollView to avoid FlatList nesting crash */}
          <ScrollView 
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollView}
          >
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
                    style={[
                      styles.listItemBase,
                      isSelected ? styles.listItemSelected : styles.listItemNormal
                    ]}
                  >
                    <Text style={[
                      styles.listItemTextBase,
                      isSelected ? styles.listItemTextSelected : styles.listItemTextNormal
                    ]}>
                      {item.label}
                    </Text>
                    {isSelected && <Check size={16} color="#0284c7" />}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}