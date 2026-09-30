import React from "react";
import { TouchableOpacity } from "react-native";
import { LocateFixed } from "lucide-react-native";

interface RecenterButtonProps {
  onPress: () => void;
}

export default function RecenterButton({ onPress }: RecenterButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="absolute right-4 bottom-72 bg-white p-3 rounded-full shadow-xl active:bg-slate-100 z-10 border border-slate-100"
    >
      <LocateFixed size={22} color="#475569" />
    </TouchableOpacity>
  );
}