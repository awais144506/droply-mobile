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
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendCode = async () => {
    if (!isLoaded || !email.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: email.trim().toLowerCase(),
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

  const handleVerifyCode = async () => {
    if (!isLoaded || !code.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white justify-center px-6"
    >
      <View className="items-center mb-8">
   
          <Image
            source={require("@/assets/images/logo.png")}
            className="h-28 w-28"
            resizeMode="contain"
          />
      </View>

      {Boolean(errorMsg) && (
        <View className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
          <Text className="text-xs text-red-600 font-medium text-center">
            {errorMsg}
          </Text>
        </View>
      )}

      {!pendingVerification ? (
        <View className="space-y-3 gap-3">
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
            <Mail size={18} color="#64748b" />
            <TextInput
              placeholder="Enter your registered email"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="flex-1 ml-2.5 text-sm text-slate-900 font-medium"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSendCode}
            disabled={loading || !email.trim()}
            className={`h-12 rounded-xl items-center justify-center mt-2 shadow-xs bg-sky-600`}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-sm">
                Login
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-3 gap-3">
          <View className="p-3 bg-sky-50 rounded-xl border border-sky-100 mb-1">
            <Text className="text-xs text-sky-800 text-center font-medium">
              We sent a 6-digit code to:
            </Text>
            <Text className="text-xs text-sky-950 font-bold text-center mt-0.5">
              {email}
            </Text>
          </View>

          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
            <KeyRound size={18} color="#64748b" />
            <TextInput
              placeholder="6-digit verification code"
              placeholderTextColor="#94a3b8"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              className="flex-1 ml-2.5 text-sm text-slate-900 font-bold tracking-widest"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleVerifyCode}
            disabled={loading || code.length < 6}
            className={`h-12 rounded-xl flex-row items-center justify-center mt-2 shadow-xs gap-2 bg-sky-600`}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <CheckCircle2 size={16} color="#ffffff" />
                <Text className="text-white font-bold text-sm">
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
            className="flex-row items-center justify-center mt-2 py-2 gap-1.5"
          >
            <ArrowLeft size={14} color="#64748b" />
            <Text className="text-xs text-slate-500 font-semibold">
              Use a different email
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}