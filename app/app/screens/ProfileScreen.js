import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { account } from "../../services/appwrite.js"; // ton fichier appwrite.js

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionUser = await account.get();
        setUser(sessionUser);
        setName(sessionUser.name || "");
        setEmail(sessionUser.email || "");
      } catch (error) {
        console.log("Erreur fetch user:", error);
        Alert.alert("Erreur", "Impossible de récupérer les informations utilisateur.");
      }
    };
    fetchUser();
  }, []);

  // Mettre à jour le profil
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // 1️⃣ Mise à jour du nom et de l'email
      if (name !== user.name || email !== user.email) {
        await account.update(
          user.$id,
          name,
          email
        );
      }

      // 2️⃣ Mise à jour du mot de passe si renseigné
      if (password) {
        await account.updatePassword(password, password); // Appwrite exige l'ancien mot de passe si tu veux sécuriser, ici simplifié
      }

      // Recharger les infos
      const updatedUser = await account.get();
      setUser(updatedUser);
      setName(updatedUser.name || "");
      setEmail(updatedUser.email || "");
      setPassword("");
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (error) {
      console.log("Erreur update:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      Alert.alert("Déconnecté", "Vous êtes maintenant déconnecté.");
      // Ici tu peux naviguer vers ton écran de connexi
       navigation.replace("LoginScreen");
    } catch (error) {
      console.log("Erreur logout:", error);
      Alert.alert("Erreur", "Impossible de se déconnecter.");
            navigation.replace("LoginScreen");
    }
  };

  if (!user) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#FF3366" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nom"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Nouveau mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Mise à jour..." : "Mettre à jour le profil"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#e63946" }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  title: { color: "#FF3366", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { color: "#fff", marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: "#222", color: "#fff", padding: 12, borderRadius: 10 },
  button: { marginTop: 20, backgroundColor: "#FF3366", padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
