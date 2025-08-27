import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Text } from "react-native-paper";
import { Checkbox } from "react-native-paper";
import { account } from "../../services/appwrite.js";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      const promise = await account.create(
        "unique()",
        email,
        password,
        username
      );
      console.log("User created:", promise);
      navigation.navigate("Signin");
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        label="Nom d'utilisateur"
        value={username}
        textColor="white"
        onChangeText={setUsername}
        style={styles.input}
        underlineColor="#FF3366"
        theme={{ colors: { primary: "#FF3366", text: "white", placeholder: "gray" } }}
      />

      <TextInput
        label="Prénom"
        textColor="white"
        value={firstname}
        onChangeText={setFirstname}
        style={styles.input}
        underlineColor="#FF3366"
        theme={{ colors: { primary: "#FF3366", text: "white", placeholder: "gray" } }}
      />

      <TextInput
        label="Nom"
        textColor="white"
        value={lastname}
        onChangeText={setLastname}
        style={styles.input}
        underlineColor="#FF3366"
        theme={{ colors: { primary: "#FF3366", text: "white", placeholder: "gray" } }}
      />

      <TextInput
        label="Email"
        textColor="white"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        underlineColor="#FF3366"
        theme={{ colors: { primary: "#FF3366", text: "white", placeholder: "gray" } }}
      />

      <TextInput
        label="Mot de passe"
        textColor="white"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        underlineColor="#FF3366"
        theme={{ colors: { primary: "#FF3366", text: "white", placeholder: "gray" } }}
      />

      <TextInput
        label="Confirmer mot de passe"
        textColor="white"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
        style={styles.input}
        underlineColor="#FF3366"
        theme={{ colors: { primary: "#FF3366", text: "white", placeholder: "gray" } }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked1 ? "checked" : "unchecked"}
          onPress={() => setChecked1(!checked1)}
          color="deeppink"
        />
        <Text style={styles.checkboxText}>
          J'ai lu et j'accepte les <Text style={styles.link}>termes et conditions</Text>
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked2 ? "checked" : "unchecked"}
          onPress={() => setChecked2(!checked2)}
          color="deeppink"
        />
        <Text style={styles.checkboxText}>
          J'ai lu et j'accepte la <Text style={styles.link}>politique de confidentialité</Text>
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked3 ? "checked" : "unchecked"}
          onPress={() => setChecked3(!checked3)}
          color="deeppink"
        />
        <Text style={styles.checkboxText}>
          J'ai lu et j'accepte le traitement de mes données personnelles à des fins d'inscription
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
        <Text style={styles.signinLink}>Vous avez déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171C26",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    color: "#FF3366",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkboxText: {
    color: "white",
    flex: 1,
    flexWrap: "wrap",
  },
  link: {
    color: "deeppink",
    textDecorationLine: "underline",
  },
 button: {
  borderColor: "#FF3366",
  borderWidth: 1,
  paddingVertical: 12,
  borderRadius: 10,
  marginTop: 15,
  alignItems: "center",
  backgroundColor: "transparent",
},
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signinLink: {
    color: "#FF3366",
    marginTop: 15,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
