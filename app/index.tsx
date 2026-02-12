import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Colors, FontSize, Radius } from "../constants";

const EXAMPLE_ADDR = "9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g";

export default function OnboardingScreen() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const auraScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Breathing Aura animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(auraScale, {
          toValue: 1.2,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(auraScale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleContinue = () => {
    if (address.length < 32) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/(tabs)/home?address=${address}`);
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setAddress(text);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const useDemo = () => {
    setAddress(EXAMPLE_ADDR);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* ANIMATED BACKGROUND GHOST CIRCLE */}
        <Animated.View
          style={[
            styles.aura,
            {
              transform: [{ scale: auraScale }],
              opacity: 0.4,
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.primary, "transparent"]}
            style={styles.full}
          />
        </Animated.View>

        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inner}
          >
            {/* TOP: BRANDING */}
            <Animated.View
              style={[
                styles.header,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.brand}>NUCLEUS</Text>
              <Text style={styles.title}>
                The future of{"\n"}Solana tracking.
              </Text>
            </Animated.View>

            {/* MIDDLE: INPUT SECTION */}
            <Animated.View
              style={[
                styles.center,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View
                style={[
                  styles.inputBox,
                  isFocused && {
                    borderColor: Colors.primary,
                    backgroundColor: Colors.surfaceHigh,
                  },
                ]}
              >
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Paste Solana address..."
                  placeholderTextColor={Colors.textMuted}
                  style={styles.input}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={Colors.primary}
                />

                {address.length === 0 ? (
                  <Pressable onPress={handlePaste} style={styles.badge}>
                    <Text style={styles.badgeText}>PASTE</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => setAddress("")}
                    style={styles.clear}
                  >
                    <Text
                      style={{ color: Colors.background, fontWeight: "bold" }}
                    >
                      ✕
                    </Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.quickFill}>
                <Text style={styles.helperText}>First time? </Text>
                <Pressable onPress={useDemo}>
                  <Text style={styles.exampleLink}>Try a demo wallet</Text>
                </Pressable>
              </View>
            </Animated.View>

            {/* BOTTOM: LAUNCH BUTTON */}
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.footer}>
                <Pressable
                  onPress={handleContinue}
                  disabled={address.length < 32}
                  style={({ pressed }) => [
                    styles.btn,
                    { opacity: address.length < 32 ? 0.3 : pressed ? 0.9 : 1 },
                  ]}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.gradientBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.btnText}>Launch Dashboard</Text>
                  </LinearGradient>
                </Pressable>
                <Text style={styles.secure}>
                  Read-only • Secure • Non-custodial
                </Text>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  full: { flex: 1, borderRadius: 1000 },
  aura: {
    position: "absolute",
    top: -150,
    right: -100,
    width: 400,
    height: 400,
  },
  inner: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between" },
  header: { marginTop: 60 },
  brand: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  center: { flex: 1, justifyContent: "center" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    height: 74,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  badge: {
    backgroundColor: `${Colors.primary}30`,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.sm,
  },
  badgeText: { color: Colors.primary, fontSize: 10, fontWeight: "900" },
  clear: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  quickFill: { flexDirection: "row", marginTop: 24, justifyContent: "center" },
  helperText: { color: Colors.textMuted, fontSize: FontSize.sm },
  exampleLink: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
  footer: { marginBottom: 35 },
  btn: { borderRadius: Radius.full, overflow: "hidden", height: 68 },
  gradientBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
  btnText: { color: Colors.text, fontSize: FontSize.lg, fontWeight: "800" },
  secure: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 18,
    fontSize: FontSize.xs,
    opacity: 0.6,
  },
});
