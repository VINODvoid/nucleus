import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "../../constants";

export default function Swap() {
  const { address } = useLocalSearchParams<{ address: string }>();

  // --- STATE ---
  const [balance, setBalance] = useState(0);
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // --- ANIMATION REFS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const swapRotate = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  // --- INITIALIZATION ---
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    if (address) setBalance(125.45); // Mock balance
  }, []);

  // --- LOGIC ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (payAmount && Number(payAmount) > 0) {
        setLoadingQuote(true);
        setTimeout(() => {
          const rate = isSwapped ? 0.0069 : 145.2;
          const calculated = (Number(payAmount) * rate).toFixed(1);
          setReceiveAmount(calculated);
          setLoadingQuote(false);
        }, 500);
      } else {
        setReceiveAmount("");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [payAmount, isSwapped]);

  // --- HANDLERS ---
  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(swapRotate, {
      toValue: isSwapped ? 0 : 1,
      duration: 300,
      easing: Easing.elastic(1.2),
      useNativeDriver: true,
    }).start();
    setIsSwapped(!isSwapped);

    const oldPay = payAmount;
    setPayAmount(receiveAmount);
    setReceiveAmount(oldPay);
  };

  const spin = swapRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const topToken = isSwapped
    ? { name: "USDC", color: "#2775CA" }
    : { name: "SOL", color: "#9945FF" };
  const bottomToken = isSwapped
    ? { name: "SOL", color: "#9945FF" }
    : { name: "USDC", color: "#2775CA" };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#0F0F16", "#050508"]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Swap</Text>
            <Pressable style={styles.settingsBtn}>
              <Ionicons name="options" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* PAY CARD */}
            <View style={[styles.card, isFocused && styles.cardFocused]}>
              <View style={styles.cardContent}>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>You pay</Text>
                  {!isSwapped && (
                    <View style={styles.maxBadge}>
                      <Text style={styles.maxText}>
                        Max {balance.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.tokenBadge}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: topToken.color },
                      ]}
                    >
                      {topToken.name === "SOL" ? (
                        <Ionicons
                          name="logo-electron"
                          size={16}
                          color="white"
                        />
                      ) : (
                        <Text style={styles.dollarIcon}>$</Text>
                      )}
                    </View>
                    <Text style={styles.tokenSymbol}>{topToken.name}</Text>
                    <Ionicons
                      name="chevron-down"
                      size={14}
                      color="#666"
                      style={{ marginLeft: 4 }}
                    />
                  </View>

                  <TextInput
                    value={payAmount}
                    onChangeText={setPayAmount}
                    placeholder="0"
                    placeholderTextColor="#444"
                    keyboardType="numeric"
                    style={styles.input}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </View>
                <Text style={styles.fiatValue}>
                  ≈ ${Number(payAmount || 0) * 145}
                </Text>
              </View>
            </View>

            {/* FLOATING SWAP BUTTON (SITS BETWEEN CARDS) */}
            <View style={styles.swapFloatingContainer}>
              <Pressable onPress={handleSwap} style={styles.swapBtnWrapper}>
                <Animated.View
                  style={[styles.swapBtn, { transform: [{ rotate: spin }] }]}
                >
                  <Ionicons
                    name="arrow-down"
                    size={20}
                    color={Colors.primary}
                  />
                </Animated.View>
              </Pressable>
            </View>

            {/* RECEIVE CARD */}
            <View style={[styles.card, styles.cardReceive]}>
              <View style={styles.cardContent}>
                <View style={styles.cardRow}>
                  <Text style={styles.label}>You receive</Text>
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.tokenBadge, styles.tokenBadgeInactive]}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: bottomToken.color },
                      ]}
                    >
                      {bottomToken.name === "SOL" ? (
                        <Ionicons
                          name="logo-electron"
                          size={16}
                          color="white"
                        />
                      ) : (
                        <Text style={styles.dollarIcon}>$</Text>
                      )}
                    </View>
                    <Text style={styles.tokenSymbol}>{bottomToken.name}</Text>
                    <Ionicons
                      name="chevron-down"
                      size={14}
                      color="#666"
                      style={{ marginLeft: 4 }}
                    />
                  </View>

                  {loadingQuote ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.primary}
                      style={{ flex: 1, alignItems: "flex-end" }}
                    />
                  ) : (
                    <TextInput
                      value={receiveAmount}
                      editable={false}
                      placeholder="0"
                      placeholderTextColor="#333"
                      style={[styles.input, styles.inputReceive]}
                      // Removed adjustsFontSizeToFit to fix TS Error
                    />
                  )}
                </View>
              </View>
            </View>

            {/* INFO */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rate</Text>
                <Text style={styles.infoValue}>1 SOL ≈ 145.20 USDC</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Network Fee</Text>
                <Text style={[styles.infoValue, { color: "#4ADE80" }]}>
                  Free
                </Text>
              </View>
            </View>

            {/* ACTION BUTTON */}
            <View
              style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20 }}
            >
              <Pressable
                onPress={() =>
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  )
                }
              >
                <Animated.View
                  style={[
                    styles.actionBtn,
                    { transform: [{ scale: btnScale }] },
                  ]}
                >
                  <LinearGradient
                    colors={[Colors.primary, "#6020A0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionText}>Review Order</Text>
                  </LinearGradient>
                </Animated.View>
              </Pressable>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F16" },
  safeArea: { flex: 1, paddingHorizontal: 16, paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: { fontSize: 34, fontWeight: "800", color: "white" },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1C1C26",
    justifyContent: "center",
    alignItems: "center",
  },

  // Cards
  card: {
    backgroundColor: "#16161E",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 8, // Space below top card
    zIndex: 1,
  },
  cardFocused: { borderColor: Colors.primary, backgroundColor: "#1A1A24" },
  cardReceive: {
    backgroundColor: "#121218",
    borderColor: "rgba(255,255,255,0.03)",
    marginTop: 8, // Space above bottom card
    zIndex: 0,
  },
  cardContent: { padding: 20, minHeight: 140, justifyContent: "center" },

  // Floating Swap Button
  swapFloatingContainer: {
    zIndex: 10,
    height: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  swapBtnWrapper: {
    backgroundColor: "#0F0F16",
    padding: 6,
    borderRadius: 50,
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#22222C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0F0F16",
  },

  // Rest of styles
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: { color: "#888", fontSize: 14, fontWeight: "600" },
  maxBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  maxText: { color: Colors.primary, fontSize: 11, fontWeight: "700" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  },
  tokenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22222C",
    padding: 8,
    paddingRight: 12,
    borderRadius: 30,
    marginRight: 12,
  },
  tokenBadgeInactive: { backgroundColor: "#1A1A20" },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  dollarIcon: { color: "white", fontWeight: "900", fontSize: 14 },
  tokenSymbol: { color: "white", fontWeight: "700", fontSize: 16 },

  // Inputs
  input: {
    flex: 1,
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "right",
    padding: 0,
  },
  inputReceive: { color: "#4ADE80" },

  fiatValue: {
    color: "#555",
    fontSize: 13,
    textAlign: "right",
    marginTop: 4,
    fontWeight: "500",
  },
  infoContainer: { marginTop: 24, paddingHorizontal: 8, gap: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { color: "#666", fontSize: 14 },
  infoValue: { color: "#CCC", fontSize: 14, fontWeight: "600" },
  actionBtn: { width: "100%", borderRadius: 28, overflow: "hidden" },
  actionGradient: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: { color: "white", fontSize: 18, fontWeight: "700" },
});
