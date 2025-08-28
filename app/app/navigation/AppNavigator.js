import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CardsProvider } from "../screens/CardsContext.js"; 
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import SessionsScreen from "../screens/ActivityScreen";   // 📌 Activité
import DownloadScreen from "../screens/DownloadScreen";   // 📌 Capteur
import ProfileScreen from "../screens/ProfileScreen";     // 📌 Profil
import ActivityDetailScreen from "../screens/ActivityDetailScreen"; 
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Onglets après connexion
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Capteur"   // ✅ Capteur devient la page par défaut
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Activité") iconName = "bar-chart-outline";
          else if (route.name === "Capteur") iconName = "cloud-download-outline";
          else if (route.name === "Profil") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#111" },
        tabBarActiveTintColor: "#e63946",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Activité" component={SessionsScreen} />
      <Tab.Screen name="Capteur" component={DownloadScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
export default function AppNavigator() {
  return (
    <CardsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signin">
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ActivityDetail"
            component={ActivityDetailScreen}
            options={{ title: "Détails de la session" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CardsProvider>
  );
}
