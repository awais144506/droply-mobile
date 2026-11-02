import { StyleSheet, Platform } from "react-native";

export const signInStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // slate-50
  },
  ambientOrbTop: {
    position: "absolute",
    top: -96,
    right: -96,
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: "rgba(224, 242, 254, 0.7)", // sky-100/70
  },
  ambientOrbBottom: {
    position: "absolute",
    bottom: -96,
    left: -96,
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: "rgba(236, 253, 245, 0.8)", // emerald-50/80
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  
  // Header Section
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoWrapper: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  portalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0f9ff", // sky-50
    borderWidth: 1,
    borderColor: "#e0f2fe", // sky-100
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  portalBadgeText: {
    fontSize: 10,
    color: "#0369a1", // sky-700
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a", // slate-900
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 12,
    color: "#64748b", // slate-500
    fontWeight: "500",
    textAlign: "center",
    marginTop: 6,
    maxWidth: 260,
    lineHeight: 18,
  },

  // Main Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  // Error Banner
  errorBanner: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: "#fff1f2", // rose-50
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecdd3", // rose-200
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#be123c", // rose-700
    fontWeight: "600",
    lineHeight: 16,
  },

  // Form Steps
  formGroup: {
    gap: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155", // slate-700
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  inputWrapperFocused: {
    backgroundColor: "#ffffff",
    borderColor: "#0284c7", // sky-600
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
  },

  // Buttons
  primaryButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0284c7", // sky-600
    ...Platform.select({
      ios: {
        shadowColor: "#0284c7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  primaryButtonDisabled: {
    backgroundColor: "#e2e8f0", // slate-200
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  primaryButtonTextDisabled: {
    color: "#94a3b8", // slate-400
  },

  // OTP Verification Section
  sentToPill: {
    padding: 14,
    backgroundColor: "#f0f9ff", // sky-50
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe", // sky-100
    alignItems: "center",
  },
  sentToLabel: {
    fontSize: 12,
    color: "#0369a1", // sky-700
    fontWeight: "500",
  },
  sentToEmail: {
    fontSize: 14,
    color: "#0f172a", // slate-900
    fontWeight: "700",
    marginTop: 2,
  },
  otpWrapper: {
    paddingVertical: 4,
  },
  otpContainer: {
    gap: 8,
    justifyContent: "center",
  },
  otpPinContainer: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1.5,
    borderRadius: 14,
    height: 54,
    width: 45,
  },
  otpPinContainerFocused: {
    backgroundColor: "#ffffff",
    borderColor: "#0284c7",
  },
  otpPinText: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "800",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },
  backButtonText: {
    fontSize: 12,
    color: "#64748b", // slate-500
    fontWeight: "700",
  },

  // Security Footer
  securityBadge: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: "center",
  },
  securityBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
});