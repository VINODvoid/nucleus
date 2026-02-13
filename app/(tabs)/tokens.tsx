import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "../../constants"; // Ensure this matches your project structure

// API Endpoint (CoinGecko Free Tier)
const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h";

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export default function Tokens() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  // --- FETCH DATA ---
  const fetchMarketData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTokens(data);
        setFilteredTokens(data);
      }
    } catch (error) {
      console.error("Failed to fetch market data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  // --- HANDLERS ---
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchMarketData();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const newData = tokens.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredTokens(newData);
    } else {
      setFilteredTokens(tokens);
    }
  };

  // --- RENDER ITEM ---
  const renderItem = ({ item, index }: { item: TokenData; index: number }) => {
    const isUp = item.price_change_percentage_24h >= 0;

    return (
      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        onPress={() => Haptics.selectionAsync()}
      >
        {/* Left: Rank & Info */}
        <View style={styles.leftSection}>
          <Text style={styles.rank}>{index + 1}</Text>
          <Image source={{ uri: item.image }} style={styles.coinImage} />
          <View>
            <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>

        {/* Right: Price & Change */}
        <View style={styles.rightSection}>
          <Text style={styles.price}>
            $
            {item.current_price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </Text>
          <View
            style={[
              styles.changeBadge,
              {
                backgroundColor: isUp
                  ? "rgba(74, 222, 128, 0.15)"
                  : "rgba(248, 113, 113, 0.15)",
              },
            ]}
          >
            <Ionicons
              name={isUp ? "caret-up" : "caret-down"}
              size={10}
              color={isUp ? "#4ADE80" : "#F87171"}
            />
            <Text
              style={[
                styles.changeText,
                { color: isUp ? "#4ADE80" : "#F87171" },
              ]}
            >
              {Math.abs(item.price_change_percentage_24h).toFixed(2)}%
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#0F0F16", "#050508"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Market</Text>
          <View style={styles.headerActions}>
            {/* You can add sort/filter buttons here later */}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search coins..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
        </View>

        {/* Column Headers */}
        <View style={styles.columnHeader}>
          <Text style={styles.colTextLeft}>Asset</Text>
          <Text style={styles.colTextRight}>Price / 24h</Text>
        </View>

        {/* List */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredTokens}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary} // iOS Spinner Color
                colors={[Colors.primary]} // Android Spinner Color
              />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={{ color: "#666" }}>No coins found.</Text>
              </View>
            }
          />
        )}
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
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "white",
    letterSpacing: -1,
  },
  headerActions: {
    // Placeholder for future buttons
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C26",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },

  // Column Headers
  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  colTextLeft: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    paddingLeft: 40, // align with text, skip rank/image
  },
  colTextRight: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
  },

  // List Item
  listContent: {
    paddingBottom: 100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
  },
  rowPressed: {
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rank: {
    color: "#444",
    fontSize: 12,
    fontWeight: "bold",
    width: 24,
    textAlign: "center",
  },
  coinImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 12,
    backgroundColor: "#222", // placeholder bg
  },
  symbol: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  price: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    fontVariant: ["tabular-nums"], // Fixed width numbers prevent jitter
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 2,
  },

  // Utilities
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
