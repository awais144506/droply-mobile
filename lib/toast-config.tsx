import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';
import { CheckCircle2, XCircle } from 'lucide-react-native';

export const customToastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.successContainer}>
      <CheckCircle2 size={24} color="#ffffff" />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{text1}</Text>
        {text2 ? <Text style={styles.subtitleText}>{text2}</Text> : null}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={styles.errorContainer}>
      <XCircle size={24} color="#ffffff" />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{text1}</Text>
        {text2 ? <Text style={styles.subtitleText}>{text2}</Text> : null}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  successContainer: {
    width: '90%',
    backgroundColor: '#059669', // emerald-600
    borderRadius: 8, // rounded-lg
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  errorContainer: {
    width: '90%',
    backgroundColor: '#e11d48', // rose-600
    borderRadius: 16, // rounded-2xl
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800', // font-extrabold
  },
  subtitleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500', // font-medium
    marginTop: 2,
  }
});