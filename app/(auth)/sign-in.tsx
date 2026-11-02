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
  Keyboard,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react-native";
import { OtpInput } from "react-native-otp-entry";
import { signInStyles as styles } from "@/components/style/sign-in-styles";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);

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
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const isSendDisabled = loading || !email.trim();
  const isVerifyDisabled = loading || code.length < 6;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Subtle Light-Mode Ambient Accents */}
      <View pointerEvents="none" style={styles.ambientOrbTop} />
      <View pointerEvents="none" style={styles.ambientOrbBottom} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.portalBadge}>
            <Text style={styles.portalBadgeText}>Droply Mobile Portal</Text>
          </View>

          <Text style={styles.titleText}>
            {!pendingVerification ? "Welcome Back" : "Verify Your Identity"}
          </Text>
          <Text style={styles.subtitleText}>
            {!pendingVerification
              ? "Sign in with your owner/manager/rider email to access your workspace."
              : "Enter the 6-digit verification code sent to your inbox to continue."}
          </Text>
        </View>

        {/* Main Card Container */}
        <View style={styles.card}>
          {/* Error Banner */}
          {Boolean(errorMsg) && (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color="#e11d48" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {!pendingVerification ? (
            <View style={styles.formGroup}>
              {/* Email Input Field */}
              <View>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    isEmailFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Mail
                    size={19}
                    color={isEmailFocused ? "#0284c7" : "#64748b"}
                  />
                  <TextInput
                    placeholder="name@company.com"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrorMsg("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSendCode}
                disabled={isSendDisabled}
                style={[
                  styles.primaryButton,
                  isSendDisabled && styles.primaryButtonDisabled,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.primaryButtonText,
                        !email.trim() && styles.primaryButtonTextDisabled,
                      ]}
                    >
                      Send Login Code
                    </Text>
                    <ArrowRight
                      size={17}
                      color={!email.trim() ? "#94a3b8" : "#ffffff"}
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formGroup}>
              {/* Sent To Pill */}
              <View style={styles.sentToPill}>
                <Text style={styles.sentToLabel}>6-digit code sent to</Text>
                <Text style={styles.sentToEmail}>{email}</Text>
              </View>

              {/* OTP Input */}
              <View style={styles.otpWrapper}>
                <OtpInput
                  numberOfDigits={6}
                  focusColor="#0284c7"
                  focusStickBlinkingDuration={500}
                  onTextChange={(text) => {
                    setCode(text);
                    setErrorMsg("");
                  }}
                  onFilled={(text) => handleVerifyCode(text)}
                  theme={{
                    containerStyle: styles.otpContainer,
                    pinCodeContainerStyle: styles.otpPinContainer,
                    focusedPinCodeContainerStyle: styles.otpPinContainerFocused,
                    pinCodeTextStyle: styles.otpPinText,
                  }}
                />
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleVerifyCode()}
                disabled={isVerifyDisabled}
                style={[
                  styles.primaryButton,
                  isVerifyDisabled && styles.primaryButtonDisabled,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <CheckCircle2
                      size={18}
                      color={code.length < 6 ? "#94a3b8" : "#ffffff"}
                      strokeWidth={2.5}
                    />
                    <Text
                      style={[
                        styles.primaryButtonText,
                        code.length < 6 && styles.primaryButtonTextDisabled,
                      ]}
                    >
                      Verify & Log In
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Back to Email Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPendingVerification(false);
                  setCode("");
                  setErrorMsg("");
                }}
                style={styles.backButton}
              >
                <ArrowLeft size={15} color="#64748b" strokeWidth={2.5} />
                <Text style={styles.backButtonText}>
                  Use a different email address
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Security Badge */}
        <View style={styles.securityBadge}>
          <ShieldCheck size={15} color="#059669" strokeWidth={2.5} />
          <Text style={styles.securityBadgeText}>
            Restricted staff session • OTP verified
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}