import { Text, View, StyleSheet, ImageComponent, Image } from "react-native";
import { Colors, FontSize } from "../constants";

type TokenRowProps = {
  name: string;
  fullName: string;
  balance: string;
  usdValue: number;
};
export default function TokenRow({
  balance,
  fullName,
  name,
  usdValue,
}: TokenRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Image source={require("../assets/coin.png")} style={styles.icon} />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.header}>{name}</Text>
          <Text style={styles.subText}>{fullName}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.solanaPrice}>{balance} SOL</Text>
        <Text style={styles.dollarPrice}>$ {usdValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 24,
    width: "90%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  left: {
    flexDirection: "row",
  },
  right: {
    flexDirection: "column",
    justifyContent: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
  subText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  dollarPrice: {
    color: Colors.success,
  },
  solanaPrice: {
    color: Colors.text,
    fontSize: FontSize.lg,
  },
});
