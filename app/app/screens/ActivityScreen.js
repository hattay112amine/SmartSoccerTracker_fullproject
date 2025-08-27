import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CardsContext } from "./CardsContext";

export default function ActivityScreen() {
  const { cards, finalStats } = useContext(CardsContext);
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState("all");

  const dates = Array.from(new Set(finalStats.map((item) => item.date)));

  const filteredStats =
    selectedDate === "all"
      ? finalStats
      : finalStats.filter((item) => item.date === selectedDate);

  const handleCardPress = (item) => {
    const sessionData = cards.filter((c) => c.date === item.date);

    if (!sessionData || sessionData.length === 0) {
      Alert.alert("⚠️ Aucun détail disponible", "Cette session n'a pas de données.");
      return;
    }

    navigation.navigate("ActivityDetail", {
      allData: sessionData,
      summary: item,
    });
  };

  if (!finalStats || finalStats.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>📊 Mes Sessions</Text>
        <Text style={styles.noDataText}>Aucune session disponible. Veuillez importer des fichiers CSV/TXT.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>📊 Mes Sessions ({finalStats.length})</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        <TouchableOpacity
          style={[styles.chip, selectedDate === "all" && styles.chipSelected]}
          onPress={() => setSelectedDate("all")}
        >
          <Text style={[styles.chipText, selectedDate === "all" && styles.chipTextSelected]}>
            Toutes
          </Text>
        </TouchableOpacity>

        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chip, selectedDate === date && styles.chipSelected]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[styles.chipText, selectedDate === date && styles.chipTextSelected]}>
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredStats}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
            <View style={styles.headerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🏃‍♂️</Text>
              </View>
              <Text style={styles.dateText}>📅 {item.date}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statsBlock}>
                <Text style={styles.label}>📏 Distance</Text>
                <Text style={styles.value}>
                  {Number(item.totalDistance || 0) / 1000} km
                </Text>
              </View>

              <View style={styles.statsBlock}>
                <Text style={styles.label}>⚡ Vitesse max</Text>
                <Text
                  style={[
                    styles.value,
                    item.maxSpeed > 25 && { color: "#FFCC00" },
                    item.maxSpeed > 30 && { color: "#FF4444" },
                  ]}
                >
                  {Number(item.maxSpeed || 0)} km/h
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statsBlock}>
                <Text style={styles.label}>🏃‍♂️ Sprints</Text>
                <Text style={styles.value}>{Number(item.sprintCount || 0)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", padding: 12 },
  pageTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  noDataText: { color: "#B3B3B3", fontSize: 14, textAlign: "center", marginTop: 50 },

  filterRow: { flexDirection: "row", marginBottom: 15 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: "#2B2B2B", borderRadius: 20, marginRight: 8 },
  chipSelected: { backgroundColor: "#FF3C7E" },
  chipText: { color: "#B3B3B3", fontSize: 13 },
  chipTextSelected: { color: "white", fontWeight: "bold" },

  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FF3C7E", justifyContent: "center", alignItems: "center", marginRight: 10 },
  avatarText: { fontSize: 20 },
  dateText: { color: "#FF3C7E", fontSize: 15, fontWeight: "bold" },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  statsBlock: { flex: 1, backgroundColor: "#2B2B2B", padding: 10, borderRadius: 12, marginHorizontal: 5, alignItems: "center" },
  label: { color: "#B3B3B3", fontSize: 13, marginBottom: 4 },
  value: { color: "white", fontSize: 15, fontWeight: "bold" },
});
