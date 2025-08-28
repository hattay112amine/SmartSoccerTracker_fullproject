import React, { useState, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Progress from "react-native-progress";
import { CardsContext } from "./CardsContext";

export default function DownloadScreen() {
  const { setCards, setFinalStats } = useContext(CardsContext);
  const [importProgress, setImportProgress] = useState(0);
  const [folderUri, setFolderUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [folderSize, setFolderSize] = useState(0);
  const { theme } = useContext(ThemeContext);
  const bgColor = theme === "dark" ? "#111" : "#fff";
  const textColor = theme === "dark" ? "#fff" : "#111";

  const chooseFolder = async () => {
    try {
      const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permission.granted) {
        setFolderUri(permission.directoryUri);
        Alert.alert("✅ Dossier sélectionné", permission.directoryUri);
      } else {
        Alert.alert("❌ Permission refusée", "Vous devez choisir un dossier pour continuer.");
      }
    } catch (err) {
      console.error("Erreur permission SD:", err);
      Alert.alert("Erreur", "Impossible de sélectionner le dossier.");
    }
  };

  const handleImport = async () => {
    if (!folderUri) {
      Alert.alert("⚠️ Choisissez un dossier avant d'importer !");
      return;
    }

    setLoading(true);
    setImportProgress(0);
    setFolderSize(0);

    let allCards = [];
    let statsArray = [];
    let totalSize = 0;

    try {
      const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(folderUri);

      const csvFiles = files
        .filter(file => typeof file === "string" && (file.endsWith(".csv") || file.endsWith(".txt")))
        .map(uri => ({ uri, name: uri.split("/").pop(), size: 0 }));

      for (let i = 0; i < csvFiles.length; i++) {
        const fileUri = csvFiles[i].uri;
        totalSize += csvFiles[i].size || 0;

        const content = await FileSystem.StorageAccessFramework.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        const lines = content.split("\n").filter(l => l.trim() !== "");
        if (lines.length < 2) continue;

        const header = lines[0].split(",").map(h => h.trim());
        const dataLines = lines.slice(1);

        // 🔹 Ajouter toutes les lignes
        dataLines.forEach(line => {
          const values = line.split(",");
          let card = {};
          header.forEach((key, index) => {
            let normalizedKey = key
              .replace("speed_kmph", "speedKmph")
              .replace("deltaDistance", "deltaDistance")
              .replace("walkDistance", "walkDistance")
              .replace("runDistance", "runDistance")
              .replace("sprintDistance", "sprintDistance")
              .replace("totalDistance", "totalDistance")
              .replace("maxSpeed", "maxSpeed")
              .replace("sprintCount", "sprintCount")
              .replace("time", "time")
              .replace("date", "date");
            card[normalizedKey] = values[index] ? values[index].trim() : "";
          });
          allCards.push(card);
        });

        // 🔹 Prendre la dernière ligne pour résumé
        const lastLine = dataLines[dataLines.length - 1].split(",");
        let final = {};
        header.forEach((key, index) => {
          let normalizedKey = key
            .replace("speed_kmph", "speedKmph")
            .replace("deltaDistance", "deltaDistance")
            .replace("walkDistance", "walkDistance")
            .replace("runDistance", "runDistance")
            .replace("sprintDistance", "sprintDistance")
            .replace("totalDistance", "totalDistance")
            .replace("maxSpeed", "maxSpeed")
            .replace("sprintCount", "sprintCount")
            .replace("time", "time")
            .replace("date", "date");
          final[normalizedKey] = lastLine[index] ? lastLine[index].trim() : "";
        });

        statsArray.push({
          totalDistance: final.totalDistance || "0",
          date: final.date || "",
          maxSpeed: final.maxSpeed || "0",
          sprintCount: final.sprintCount || "0",
          walkDistance: final.walkDistance || "0",
          runDistance: final.runDistance || "0",
          sprintDistance: final.sprintDistance || "0",
          gameTime: final.gameTime || "0m 0s",
        });

        setImportProgress((i + 1) / csvFiles.length);
      }

      setCards(allCards);
      setFinalStats(statsArray);
      setFolderSize(totalSize);
      Alert.alert("✅ Importation terminée !");
    } catch (err) {
      console.error("Erreur importation:", err);
      Alert.alert("❌ Erreur importation", err.message || err.toString());
    }

    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../assets/football-bg.jpeg")}
      style={styles.background}
      imageStyle={{ opacity: 0.65 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}
      >
        <Image
          source={require("../assets/soccer-ball.png")}
          style={{ width: 80, height: 80, marginBottom: 20 }}
        />

        {!folderUri && !loading && (
          <Text style={[styles.text, {
            marginBottom: 15,
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 5,
            borderRadius: 8,
          }]}>
            ⚠️ Aucune session sélectionnée. Veuillez choisir un dossier CSV/TXT pour importer vos sessions.
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={chooseFolder}>
          <Text style={styles.buttonText}>📂 Choisir le dossier CSV/TXT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: folderUri ? "#FF3366" : "#888" }]}
          onPress={handleImport}
          disabled={!folderUri || loading}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> :
            <Text style={styles.buttonText}>⬇️ Importer sessions</Text>}
        </TouchableOpacity>

        {importProgress > 0 && importProgress < 1 && (
          <>
            <Progress.Circle
              progress={importProgress}
              size={80}
              showsText
              color="#FF3366"
              style={{ marginTop: 20 }}
            />
            <Progress.Bar
              progress={importProgress}
              width={250}
              color="#FF3366"
              style={{ marginTop: 10 }}
            />
            <Text style={styles.text}>⏳ Progression : {(importProgress * 100).toFixed(0)} %</Text>
          </>
        )}

        {folderSize > 0 && (
          <Text style={styles.text}>📦 Taille dossier : {(folderSize / 1024 / 1024).toFixed(2)} Mo</Text>
        )}
      </ScrollView>
    </ImageBackground>
  );

}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, backgroundColor: "transparent", padding: 10 },
  button: {
    backgroundColor: "#FF3366",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  text: { color: "white", fontSize: 14, marginBottom: 4 },
});
