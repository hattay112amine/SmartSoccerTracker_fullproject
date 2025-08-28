import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from "react-native";
import { account } from "../../services/appwrite.js";
import * as ImagePicker from "expo-image-picker";
import { ThemeContext } from "./ThemeContext.js"; // contexte pour thème global

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext); // thème global

  // Récupérer les infos utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionUser = await account.get();
        setUser(sessionUser);
        setName(sessionUser.name || "");
        setEmail(sessionUser.email || "");
        // si tu stockes avatar dans metadata
        setAvatar(sessionUser.prefs?.avatar || null);
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
      // 1️⃣ Nom et email
      if (name !== user.name || email !== user.email) {
        await account.update(user.$id, name, email);
      }
      // 2️⃣ Mot de passe si renseigné
      if (password) {
        await account.updatePassword(password, password);
      }
      // 3️⃣ Avatar (si tu veux stocker dans prefs)
      if (avatar) {
        await account.updatePrefs({ avatar });
      }
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

  // Choisir avatar
  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  // Supprimer le compte
  const handleDeleteAccount = () => {
    Alert.alert("Attention", "Voulez-vous vraiment supprimer votre compte ?", [
      { text: "Annuler" },
      {
        text: "Oui",
        onPress: async () => {
          try {
            await account.delete();
            Alert.alert("Compte supprimé", "Votre compte a été supprimé.");
            navigation.replace("Signup");
          } catch (error) {
            console.log("Erreur suppression compte:", error);
            Alert.alert("Erreur", "Impossible de supprimer le compte.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (!user) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#FF3366" />;

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#111" : "#fff" }]}>
      <Text style={[styles.title, { color: theme === "dark" ? "#FF3366" : "#FF3366" }]}>Profil</Text>

      {/* Avatar */}
      <TouchableOpacity onPress={pickAvatar}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ color: "#888" }}>Ajouter une photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Nom</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme === "dark" ? "#222" : "#eee", color: theme === "dark" ? "#fff" : "#000" }]}
        value={name}
        onChangeText={setName}
        placeholder="Nom"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme === "dark" ? "#222" : "#eee", color: theme === "dark" ? "#fff" : "#000" }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
      />

      <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Nouveau mot de passe</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme === "dark" ? "#222" : "#eee", color: theme === "dark" ? "#fff" : "#000" }]}
        value={password}
        onChangeText={setPassword}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Mise à jour..." : "Mettre à jour le profil"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#4a90e2" }]} onPress={toggleTheme}>
        <Text style={styles.buttonText}>Changer thème {theme === "dark" ? "clair" : "sombre"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#e63946" }]} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Supprimer mon compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { marginTop: 15, marginBottom: 5 },
  input: { padding: 12, borderRadius: 10 },
  button: { marginTop: 20, padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, alignSelf: "center" },
});
