import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { Colors } from "../../constants"; // Ensure this path is correct
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Mock Data for Actions
const ACTIONS = [
  { id: "send", icon: "arrow-up", label: "Send", color: "#10B981" },
  { id: "receive", icon: "arrow-down", label: "Receive", color: "#3B82F6" },
  {
    id: "swap",
    icon: "swap-horizontal",
    label: "Swap",
    color: "#8B5CF6",
    route: "/(tabs)/swap",
  },
  { id: "history", icon: "time", label: "History", color: "#F59E0B" },
];

export default function Dashboard() {
  const router = useRouter();
  const { address } = useLocalSearchParams<{ address: string }>();

  // State
  const [balance, setBalance] = useState(0);
  const [solPrice, setSolPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Helper: Truncate Address
  const shortAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "No Wallet";

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Fetch Data Logic
  const fetchData = async () => {
    try {
      if (!address) return;

      // 1. Get Balance
      const balanceRes = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "getBalance",
          params: [address],
        }),
      });
      const balanceData = await balanceRes.json();
      const solBal = balanceData.result?.value
        ? balanceData.result.value / 1000000000
        : 0;
      setBalance(solBal);

      // 2. Get Price
      const priceRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      );
      const priceData = await priceRes.json();
      setSolPrice(priceData.solana.usd);
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [address]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchData();
  }, []);

  const copyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleAction = (action: (typeof ACTIONS)[0]) => {
    Haptics.selectionAsync();
    if (action.route) {
      router.push(action.route);
    } else {
      // Placeholder for other actions
      alert(`${action.label} feature coming soon!`);
    }
  };

  // Calculated Values
  const netWorth = (balance * solPrice).toFixed(2);
  const wholePart = netWorth.split(".")[0];
  const decimalPart = netWorth.split(".")[1];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#0F0F16", "#050508"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.username}>Kalki</Text>
            </View>
            <Pressable style={styles.profileBtn}>
              <LinearGradient
                colors={["#2A2A35", "#1A1A22"]}
                style={styles.profileGradient}
              >
                <Ionicons name="person" size={20} color="white" />
              </LinearGradient>
            </Pressable>
          </View>

          {/* MAIN CARD (Net Worth) */}
          <View style={styles.mainCard}>
            <Pressable onPress={copyAddress} style={styles.addressPill}>
              <Ionicons name="wallet-outline" size={14} color="#888" />
              <Text style={styles.addressText}>{shortAddress}</Text>
              <Ionicons name="copy-outline" size={12} color="#888" />
            </Pressable>

            <View style={styles.balanceContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <Text style={styles.balanceWhole}>{wholePart}</Text>
              <Text style={styles.balanceDecimal}>.{decimalPart}</Text>
            </View>

            <View style={styles.changeBadge}>
              <Ionicons name="trending-up" size={14} color="#4ADE80" />
              <Text style={styles.changeText}>+2.4% (24h)</Text>
            </View>
          </View>

          {/* ACTION GRID */}
          <View style={styles.actionGrid}>
            {ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={styles.actionItem}
                onPress={() => handleAction(action)}
              >
                <View style={styles.actionIconWrapper}>
                  <LinearGradient
                    colors={["#252530", "#16161E"]}
                    style={styles.actionGradient}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  </LinearGradient>
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ASSETS SECTION */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Assets</Text>
            <Ionicons name="options-outline" size={20} color="#666" />
          </View>

          {/* Asset List */}
          <View style={styles.assetList}>
            {/* SOL ROW */}
            <Pressable style={styles.assetRow}>
              <View style={styles.assetLeft}>
                <View style={[styles.coinIcon, { backgroundColor: "#9945FF" }]}>
                  <Ionicons name="logo-electron" size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.assetName}>Solana</Text>
                  <Text style={styles.assetPrice}>${solPrice.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetBalance}>${netWorth}</Text>
                <Text style={styles.assetAmount}>{balance.toFixed(4)} SOL</Text>
              </View>
            </Pressable>

            {/* Placeholder for USDC (Simulated) */}
            <Pressable style={styles.assetRow}>
              <View style={styles.assetLeft}>
                <View style={[styles.coinIcon, { backgroundColor: "#2775CA" }]}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>$</Text>
                </View>
                <View>
                  <Text style={styles.assetName}>USDC</Text>
                  <Text style={styles.assetPrice}>$1.00</Text>
                </View>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetBalance}>$0.00</Text>
                <Text style={styles.assetAmount}>0.00 USDC</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F16",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  greeting: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  username: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  profileBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profileGradient: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  // Main Card
  mainCard: {
    alignItems: "center",
    marginBottom: 32,
  },
  addressPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  addressText: {
    color: "#888",
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  currencySymbol: {
    color: "#888",
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 6,
    marginRight: 4,
  },
  balanceWhole: {
    color: "white",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -1,
  },
  balanceDecimal: {
    color: "#888",
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 6,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    color: "#4ADE80",
    fontSize: 12,
    fontWeight: "700",
  },

  // Action Grid
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  actionItem: {
    alignItems: "center",
    gap: 8,
  },
  actionIconWrapper: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  actionLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },

  // Assets
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  assetList: {
    gap: 12,
  },
  assetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#16161E",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  assetName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  assetPrice: {
    color: "#666",
    fontSize: 12,
  },
  assetRight: {
    alignItems: "flex-end",
  },
  assetBalance: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  assetAmount: {
    color: "#666",
    fontSize: 12,
  },
});
