import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Keyboard
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { OtpInput } from "react-native-otp-entry";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Basic frontend security: validate format before hitting the Clerk API
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSendCode = async () => {
    if (!isLoaded) return;
    
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    Keyboard.dismiss();

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: cleanEmail,
      });

      const emailCodeFactor: any = supportedFirstFactors?.find(
        (factor: any) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setPendingVerification(true);
      } else {
        setErrorMsg("Email code login is not enabled for this account.");
      }
    } catch (err: any) {
      setErrorMsg(
        err.errors?.[0]?.message || "Could not find account. Check your email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Accepts an optional parameter so the OTP auto-fill can trigger it instantly
  const handleVerifyCode = async (autoSubmitCode?: string) => {
    if (!isLoaded) return;
    
    const finalCode = (autoSubmitCode || code).trim();
    if (finalCode.length !== 6) return;

    setLoading(true);
    setErrorMsg("");
    Keyboard.dismiss();

    try {
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: finalCode,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/");
      } else {
        setErrorMsg("Unable to complete sign in. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(
        err.errors?.[0]?.message || "Invalid or expired 6-digit code."
      );
      setCode(""); // Clear the code on failure so they can try again easily
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <Image
            source={require("@/assets/images/logo.png")}
            className="h-40 w-40"
            resizeMode="contain"
          />
        </View>

        {Boolean(errorMsg) && (
          <View className="mb-6 p-3 bg-rose-50 rounded-xl border border-rose-200">
            <Text className="text-xs text-rose-600 font-medium text-center">
              {errorMsg}
            </Text>
          </View>
        )}

        {!pendingVerification ? (
          <View className="space-y-4 gap-4">
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-14">
              <Mail size={20} color="#64748b" />
              <TextInput
                placeholder="Enter your registered email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMsg("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 ml-3 text-base text-slate-900 font-medium"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSendCode}
              disabled={loading || !email.trim()}
              className={`h-14 rounded-xl items-center justify-center shadow-sm ${
                loading || !email.trim() ? "bg-sky-400" : "bg-sky-600 active:bg-sky-700"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-extrabold text-base tracking-wide">
                  Send Login Code
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4 gap-4">
            <View className="p-4 bg-sky-50 rounded-xl border border-sky-100 mb-2">
              <Text className="text-sm text-sky-800 text-center font-medium">
                We sent a secure 6-digit code to:
              </Text>
              <Text className="text-sm text-sky-950 font-bold text-center mt-1">
                {email}
              </Text>
            </View>

            <View className="py-2">
              <OtpInput
                numberOfDigits={6}
                focusColor="#0284c7"
                focusStickBlinkingDuration={500}
                onTextChange={(text) => {
                  setCode(text);
                  setErrorMsg("");
                }}
                onFilled={(text) => handleVerifyCode(text)} // 🔥 Auto-submits on the 6th digit
                theme={{
                  containerStyle: { gap: 8, justifyContent: "center" },
                  pinCodeContainerStyle: {
                    backgroundColor: "#f8fafc",
                    borderColor: "#e2e8f0",
                    borderWidth: 1,
                    borderRadius: 12,
                    height: 56,
                    width: 48,
                  },
                  pinCodeTextStyle: {
                    color: "#0f172a",
                    fontSize: 22,
                    fontWeight: "bold",
                  },
                }}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleVerifyCode()}
              disabled={loading || code.length < 6}
              className={`h-14 rounded-xl flex-row items-center justify-center shadow-sm gap-2 mt-2 ${
                loading || code.length < 6 ? "bg-sky-400" : "bg-sky-600 active:bg-sky-700"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <CheckCircle2 size={18} color="#ffffff" />
                  <Text className="text-white font-extrabold text-base tracking-wide">
                    Verify & Log In
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPendingVerification(false);
                setCode("");
                setErrorMsg("");
              }}
              className="flex-row items-center justify-center py-3 gap-1.5"
            >
              <ArrowLeft size={16} color="#64748b" />
              <Text className="text-sm text-slate-500 font-bold">
                Use a different email
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}