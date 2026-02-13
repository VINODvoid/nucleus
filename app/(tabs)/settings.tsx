import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { Colors } from "../../constants"; // Ensure path matches your project

// --- MOCK DATA ---
const SECTIONS = [
  {
    title: "Preferences",
    items: [
      {
        id: "currency",
        icon: "cash-outline",
        label: "Currency",
        value: "USD",
        type: "link",
        color: "#10B981",
      },
      {
        id: "lang",
        icon: "language-outline",
        label: "Language",
        value: "English",
        type: "link",
        color: "#3B82F6",
      },
      {
        id: "notifications",
        icon: "notifications-outline",
        label: "Notifications",
        type: "toggle",
        color: "#F59E0B",
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        id: "biometrics",
        icon: "scan-outline",
        label: "Face ID",
        type: "toggle",
        color: "#8B5CF6",
      },
      {
        id: "recovery",
        icon: "key-outline",
        label: "Recovery Phrase",
        type: "link",
        color: "#EC4899",
      },
      {
        id: "pin",
        icon: "lock-closed-outline",
        label: "Change PIN",
        type: "link",
        color: "#6366F1",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        id: "help",
        icon: "help-buoy-outline",
        label: "Help Center",
        type: "link",
        color: "#14B8A6",
      },
      {
        id: "twitter",
        icon: "logo-twitter",
        label: "Follow us",
        type: "link",
        color: "#0EA5E9",
      },
    ],
  },
];

export default function Settings() {
  // --- STATE ---
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    biometrics: false,
  });

  const walletAddress = "9B5X...J6Ns"; // Mock address

  // --- HANDLERS ---
  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePress = (label: string) => {
    Haptics.selectionAsync();
    // Navigate or Show Modal here
    Alert.alert("Selected", `Navigating to ${label}`);
  };

  const copyAddress = async () => {
    await Clipboard.setStringAsync(
      "9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g",
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied", "Address copied to clipboard");
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Disconnect Wallet", "Are you sure you want to disconnect?", [
      { text: "Cancel", style: "cancel" },
      { text: "Disconnect", style: "destructive" },
    ]);
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={["#1A1A22", "#13131A"]}
              style={styles.profileGradient}
            >
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={32} color="#FFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Kalki</Text>
                <Pressable onPress={copyAddress} style={styles.addressRow}>
                  <Text style={styles.profileAddress}>{walletAddress}</Text>
                  <Ionicons name="copy-outline" size={12} color="#888" />
                </Pressable>
              </View>
              <Pressable
                style={styles.editBtn}
                onPress={() => handlePress("Edit Profile")}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </LinearGradient>
          </View>

          {/* SETTINGS GROUPS */}
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionBody}>
                {section.items.map((item, index) => (
                  <Pressable
                    key={item.id}
                    onPress={() =>
                      item.type === "link" && handlePress(item.label)
                    }
                    style={({ pressed }) => [
                      styles.row,
                      index !== section.items.length - 1 && styles.rowBorder,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    {/* Left Icon */}
                    <View style={styles.rowLeft}>
                      <View
                        style={[
                          styles.iconBox,
                          { backgroundColor: `${item.color}20` },
                        ]}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={18}
                          color={item.color}
                        />
                      </View>
                      <Text style={styles.rowLabel}>{item.label}</Text>
                    </View>

                    {/* Right Action */}
                    <View style={styles.rowRight}>
                      {item.type === "link" ? (
                        <>
                          {item.value && (
                            <Text style={styles.rowValue}>{item.value}</Text>
                          )}
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color="#666"
                            style={{ marginLeft: 8 }}
                          />
                        </>
                      ) : (
                        <Switch
                          value={toggles[item.id]}
                          onValueChange={() => handleToggle(item.id)}
                          trackColor={{ false: "#333", true: Colors.primary }}
                          thumbColor="#FFF"
                          ios_backgroundColor="#333"
                        />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          {/* LOGOUT BUTTON */}
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Disconnect Wallet</Text>
          </Pressable>

          <Text style={styles.versionText}>Nucleus v1.0.4 • Build 240</Text>
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
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "white",
    letterSpacing: -1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Profile Card
  profileCard: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  profileGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A35",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  profileAddress: {
    color: "#888",
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  editBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editBtnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionBody: {
    backgroundColor: "#16161E",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#16161E", // Default
  },
  rowPressed: {
    backgroundColor: "#1C1C26",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowValue: {
    color: "#666",
    fontSize: 14,
  },

  // Footer
  logoutBtn: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    color: "#444",
    textAlign: "center",
    fontSize: 12,
    marginBottom: 20,
  },
});
