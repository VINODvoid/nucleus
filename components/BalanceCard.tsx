import { LinearGradient } from "expo-linear-gradient";
import { Colors, FontSize, Radius } from "../constants";
import { Text, StyleSheet } from "react-native";

type BalanceCardProps = {
  balance: number;
  address: string;
};

export default function BalanceCard({ address, balance }: BalanceCardProps) {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text
        style={{
          fontSize: FontSize.md,
          fontFamily: "monospace",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        Address: {address.slice(0, 4) + "..." + address.slice(-4)}
      </Text>
      <Text
        style={{
          fontSize: FontSize.md,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        SOL Balance
      </Text>
      <Text
        style={{
          fontSize: FontSize.xxl,
          fontVariant: ["tabular-nums"],
          color: "rgba(255,255,255,1)",
        }}
      >
        {balance.toFixed(3)} SOL
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    padding: 24,
    width: "90%",
  },
});
