import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WebViewScreen from "../screens/WebViewScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator  screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "PWA 1") {
            iconName = focused ? "globe" : "globe-outline";
          } else if (route.name === "PWA 2") {
            iconName = focused ? "browsers" : "browsers-outline";
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}>
      <Tab.Screen name="PWA 1" children={() => <WebViewScreen screenName={"PWA 1"} uri="http://192.168.1.10:3000" />} />
      <Tab.Screen name="PWA 2" children={() => <WebViewScreen screenName={"PWA 2"} uri="http://192.168.1.10:3001/" />} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
