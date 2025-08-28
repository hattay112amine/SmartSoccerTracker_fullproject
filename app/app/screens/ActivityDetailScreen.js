import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarChart, PieChart, StackedBarChart } from "react-native-chart-kit";
import { Canvas, Line, Text as SkiaText, useFont } from "@shopify/react-native-skia";

export default function ActivityDetailScreen({ route }) {
  const { allData } = route.params;
  const [activeTab, setActiveTab] = useState("stats");
  const screenWidth = Dimensions.get("window").width - 40;

  const lastData = allData[allData.length - 1] || {};

  const parseNumber = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const getTimeInMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 60 + m + (s ? s / 60 : 0);
  };

  const timeMinutes = allData.map(d => getTimeInMinutes(d.time));
  const labels = allData.map(d => d.time ? d.time.substring(0,5) : "");

  const speedData = allData.map(d => parseNumber(d.speedKmph));
  const deltaDistanceData = allData.map(d => parseNumber(d.deltaDistance));
  const walkData = allData.map(d => parseNumber(d.walkDistance));
  const runData = allData.map(d => parseNumber(d.runDistance));
  const sprintData = allData.map(d => parseNumber(d.sprintDistance));

  const movementPie = [
    { name: "Marche", population: parseNumber(lastData.walkDistance), color: "#FFCC00", legendFontColor: "#fff", legendFontSize: 14 },
    { name: "Course", population: parseNumber(lastData.runDistance), color: "#00CCFF", legendFontColor: "#fff", legendFontSize: 14 },
    { name: "Sprint", population: parseNumber(lastData.sprintDistance), color: "#FF3366", legendFontColor: "#fff", legendFontSize: 14 },
  ];

  // Skia font
  const font = useFont(require("../assets/Roboto-Regular.ttf"), 12);
  if (!font) return null; // empêche le rendu si la font n'est pas chargée

  const margin = 40;
  const height = 250;
  const maxSpeed = Math.max(...speedData, 1);
  const xStep = 2; // largeur entre points pour scroll horizontal
  const maxCanvasWidth = 8000; // largeur max pour éviter crash
  const canvasWidth = Math.min(Math.max(screenWidth, speedData.length * xStep + margin), maxCanvasWidth);

  const points = speedData.map((speed, i) => ({
    x: i * xStep + margin,
    y: height - (isNaN(speed) ? 0 : (speed / maxSpeed) * height)
  }));

  const yAxisSteps = 5;
  const yStepValue = maxSpeed / yAxisSteps;

  return (
    <ScrollView style={styles.container}>
      {/* Résumé */}
      <View style={styles.summaryCard}>
        <Text style={styles.sessionTitle}>Résumé de la session</Text>
        <Text style={styles.text}>📅 Date: {lastData.date || "-"}</Text>
        <Text style={styles.text}>⏱ Temps de jeu: {lastData.gameTime || "-"}</Text>
        <Text style={styles.text}>📏 Distance totale: {parseNumber(lastData.totalDistance)} m</Text>
        <Text style={styles.text}>⚡ Vitesse max: {parseNumber(lastData.maxSpeed)} km/h</Text>
        <Text style={styles.text}>🏃‍♂️ Sprints: {parseNumber(lastData.sprintCount)}</Text>
      </View>

      {/* Onglets */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "stats" && styles.activeTab]}
          onPress={() => setActiveTab("stats")}
        >
          <Text style={styles.tabText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "charts" && styles.activeTab]}
          onPress={() => setActiveTab("charts")}
        >
          <Text style={styles.tabText}>Graphiques</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "stats" ? (
        <View style={styles.statCard}>
          <Text style={styles.cardTitle}>Statistiques finales</Text>
          {[
            { label: "📏 Distance totale", value: lastData.totalDistance },
            { label: "⚡ Vitesse max", value: lastData.maxSpeed, suffix: " km/h" },
            { label: "⏱ Temps de jeu", value: lastData.gameTime },
            { label: "🏃‍♂️ Sprints", value: lastData.sprintCount }
          ].map((item, idx) => (
            <View key={idx} style={styles.statRow}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>
                {item.value !== undefined 
                  ? (typeof item.value === "number" ? parseNumber(item.value).toFixed(2) : item.value) 
                  : "-"}{item.suffix || ""}
              </Text>
            </View>
          ))}

          {["Marche", "Course", "Sprint"].map((type, idx) => {
            const color = type === "Marche" ? "#FFCC00" : type === "Course" ? "#00CCFF" : "#FF3366";
            const distance = type === "Marche" ? lastData.walkDistance : type === "Course" ? lastData.runDistance : lastData.sprintDistance;
            return (
              <View key={idx} style={styles.progressContainer}>
                <Text style={styles.progressLabel}>{type}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min((parseNumber(distance) / (parseNumber(lastData.totalDistance) || 1)) * 100, 100)}%`, backgroundColor: color }
                    ]}
                  />
                </View>
                <Text style={styles.progressValue}>
                  {distance !== undefined && distance !== null ? parseNumber(distance).toFixed(2) : "0"} m
                </Text>
              </View>
            );
          })}

          <View style={styles.durationContainer}>
            <Text style={styles.durationTitle}>⏱ Durées par activité</Text>
            <Text style={styles.durationText}>Sprint: {lastData.sprintDuration || "-"}</Text>
            <Text style={styles.durationText}>Course: {lastData.runDuration || "-"}</Text>
            <Text style={styles.durationText}>Marche: {lastData.walkDuration || "-"}</Text>
          </View>
        </View>
      ) : (
        <View>
          {/* Vitesse vs Temps avec Skia */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Vitesse (km/h)</Text>
         <ScrollView horizontal>
  <Canvas style={{ width: canvasWidth, height: height+60 }}>
    {/* Axe Y */}
    {[...Array(yAxisSteps + 1)].map((_, i) => {
      const y = height - (i / yAxisSteps) * height;
      return (
        <React.Fragment key={"y"+i}>
          <Line
            p1={{ x: margin - 5, y }}
            p2={{ x: canvasWidth, y }}
            color="#444"
            strokeWidth={1}
          />
          <SkiaText
            x={0}
            y={y + 4}
           text={((i * yStepValue).toFixed(1))}
            font={font}
            color="white"
          />
        </React.Fragment>
      );
    })}

    {/* Courbe */}
    {points.map((p, i) => i > 0 && (
      <Line
        key={i}
        p1={points[i - 1]}
        p2={p}
        color="#FF3366"
        strokeWidth={2}
      />
    ))}

    {/* Axe X */}
    {labels.map((t, i) => (
      i % Math.ceil(labels.length / 5) === 0 && (
        <React.Fragment key={"x"+i}>
          <Line
            p1={{ x: points[i].x, y: height }}
            p2={{ x: points[i].x, y: height + 5 }}
            color="white"
            strokeWidth={1}
          />
          <SkiaText
            x={points[i].x - 10}
            y={height + 20}
            text={t}
            font={font}
            color="white"
          />
        </React.Fragment>
      )
    ))}
  </Canvas>
</ScrollView>

          </View>

       {/* Distance par pas */}
<View style={styles.chartCard}>
  <Text style={styles.cardTitle}>Distance par pas (m)</Text>
  <ScrollView horizontal>
    <BarChart
      data={{ labels, datasets: [{ data: deltaDistanceData }] }}
      width={Math.max(screenWidth, labels.length * 30)}  // largeur adaptative
      height={220}
      yAxisSuffix=" m"
      chartConfig={{
        backgroundGradientFrom: "#222",
        backgroundGradientTo: "#222",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(0, 204, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
      style={{ borderRadius: 12 }}
      fromZero
    />
  </ScrollView>
</View>

{/* Répartition Marche / Course / Sprint */}
<View style={styles.chartCard}>
  <Text style={styles.cardTitle}>Répartition Marche / Course / Sprint</Text>
  <ScrollView horizontal>
    <StackedBarChart
      data={{
        labels,
        legend: ["Marche", "Course", "Sprint"],
        data: labels.map((_, i) => [
          walkData[i] || 0,
          runData[i] || 0,
          sprintData[i] || 0,
        ]),
        barColors: ["#FFCC00", "#00CCFF", "#FF3366"],
      }}
      width={Math.max(screenWidth, labels.length * 60)} // largeur dynamique
      height={220}
      chartConfig={{
        backgroundGradientFrom: "#222",
        backgroundGradientTo: "#222",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
        labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
      }}
      style={{ borderRadius: 12 }}
    />
  </ScrollView>
</View>
          {/* Camembert */}
          <View style={styles.chartCard}>
            <PieChart
              data={movementPie}
             width={screenWidth}             
              height={220}
              chartConfig={{ color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Styles inchangés
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  summaryCard: { backgroundColor: "#222", padding: 15, borderRadius: 12, margin: 10 },
  sessionTitle: { color: "#FF3366", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  text: { color: "white", fontSize: 14, marginBottom: 5 },
  tabs: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "#333", marginHorizontal: 5 },
  activeTab: { backgroundColor: "#FF3366" },
  tabText: { color: "white", fontWeight: "bold" },
  statCard: { backgroundColor: "#222", padding: 15, borderRadius: 12, margin: 10 },
  cardTitle: { color: "#FF3366", fontWeight: "bold", marginBottom: 10 },
  statRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  statLabel: { color: "#fff", fontSize: 16 },
  statValue: { color: "#FF3366", fontWeight: "bold", fontSize: 16 },
  progressContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  progressLabel: { color: "#fff", width: 60 },
  progressBar: { flex: 1, height: 10, backgroundColor: "#444", borderRadius: 5, marginHorizontal: 8 },
  progressFill: { height: 10, borderRadius: 5 },
  progressValue: { color: "#fff", width: 50, textAlign: "right" },
  durationContainer: { marginTop: 15 },
  durationTitle: { color: "#FF3366", fontWeight: "bold", marginBottom: 5 },
  durationText: { color: "#fff", marginBottom: 3 },
  chartCard: { backgroundColor: "#222", padding: 15, borderRadius: 12, margin: 10, alignItems: "center" },
});
