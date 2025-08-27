import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { account } from "../../services/appwrite.js";

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignin = async () => {
    try {
      // Vérifier si une session est déjà active
      const currentSession = await account.getSession("current").catch(() => null);

      if (currentSession) {
        console.log("Session déjà active:", currentSession);
        navigation.replace("MainTabs"); // Aller directement dans l'app
        return;
      }

      // Sinon supprimer toutes les anciennes sessions (sécurité)
      await account.deleteSessions();

      // Créer une nouvelle session avec email + mot de passe
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Nouvelle session créée:", session);
      navigation.replace("MainTabs");
    } catch (err) {
      console.log("Erreur de connexion:", err);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Bienvenue sur</Text>
        <MaskedView
          maskElement={
            <Text style={[styles.brand, { backgroundColor: "transparent" }]}>
              Smart soccer tracker
            </Text>
          }
          style={{ width: "100%", height: 30 }}
        >
          <LinearGradient
            colors={["#FF9966", "#FF5E62", "#FF3366"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </MaskedView>
      </View>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        underlineColor="#FF3366"
        activeUnderlineColor="#FF3366"
        textColor="#fff"
        keyboardType="email-address"
      />

      <TextInput
        label="Mot de passe"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        underlineColor="#FF3366"
        activeUnderlineColor="#FF3366"
        textColor="#fff"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="outlined"
        onPress={handleSignin}
        style={styles.button}
        labelStyle={{ color: "#fff" }}
      >
        Valider
      </Button>

      <Button
        onPress={() => navigation.navigate("Signup")}
        labelStyle={{
          textDecorationLine: "underline",
          color: "#FF3366",
        }}
      >
        Créer un compte
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#171C26",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  button: {
    borderColor: "#FF3366",
    borderWidth: 1,
    marginTop: 20,
  },
  error: {
    color: "#FF3366",
    marginBottom: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 21,
    marginBottom: 5,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  brand: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
});
