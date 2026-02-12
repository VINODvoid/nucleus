import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import BalanceCard from "../../components/BalanceCard";
import { Ionicons } from "@expo/vector-icons";
import TokenRow from "../../components/TokenRow";
import { Colors, FontSize } from "../../constants";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const url = "https://api.mainnet-beta.solana.com";
  const { address } = useLocalSearchParams<{ address: string }>();
  const [solPrice, setSolPrice] = useState(0);

  const Greetings = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Morning";
    if (hours >= 12 && hours < 17) return "Afternoon";
    return "Evening";
  };
  const greeting = Greetings();

  useEffect(() => {
    const fetchPrice = async () => {
      if (!address) return;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "getBalance",
            params: [address],
          }),
        });
        const data = await response.json();
        setBalance(data.result.value / 1000000000);
        setLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Something went wrong");
        }
      }
    };
    fetchPrice();
  }, []);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const price = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        );
        const data = await price.json();
        setSolPrice(data.solana.usd);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Something went wrong");
        }
      }
    };
    fetchSolPrice();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Good {greeting}, Kalki</Text>
        <Ionicons name="wallet-outline" size={24} color="#ffffff" />
      </View>
      <BalanceCard balance={balance} address={address} />
      <View style={{ width: "90%" }}>
        <Text style={styles.sectionTitleText}>Portfolio</Text>
      </View>
      <TokenRow
        balance={balance.toFixed(2)}
        name="SOL"
        fullName="Solana"
        usdValue={parseFloat((balance * solPrice).toFixed(2))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleText: {
    fontSize: FontSize.md,
    color: Colors.text,
    marginTop: 20,
    width: "90%",
    marginBottom: 8,
  },
  container: {
    backgroundColor: "#0a0a0f",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    flex: 1,
  },
  heading: {
    fontSize: 32,
    color: "#f2f2f2",
  },
  text: {
    color: "#f5f5f5",
    fontSize: 21,
  },
  header: {
    alignItems: "center",
    width: "90%",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 20,
  },
});
