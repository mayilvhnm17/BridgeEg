import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import WebViewScreen from "../screens/WebViewScreen";
import { DrawerActions, useNavigation ,useRoute} from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View } from "react-native";
import { sendToWebView } from "../bridge/rpcBridge";

const Drawer = createDrawerNavigator();
const CustomHeader = ({ title }: { title: string }) => {
    const navigation = useNavigation();

    return {
        title: title,
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginLeft: 15 }}>
                <Ionicons name="menu" size={28} color="black" />
            </TouchableOpacity>
        ),
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                    //So if a redirection inside a PWA from anywhere is needed you have redirect 
                    //Need to find a proper way to navigate
                    // into that PWA first because of webview we can't send message to any webview 
                    // without it being open and then can send the navigtion data which will redirect 
                    // inside PWA
                    if(title == "Help")
                        navigation.navigate("Home");
                    navigation.navigate("PWA 2");
                    sendToWebView("PWA 2",{method:"Navigation",route:"Card"})}} style={{ marginLeft: 15 }}>
                    <Ionicons name="albums-outline" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if(title == "Help")
                        navigation.navigate("Home");
                    navigation.navigate("PWA 2");
                    sendToWebView("PWA 2",{method:"Navigation",route:"Positive"})}} style={{ marginLeft: 15 }}>
                    <Ionicons name="add-outline" size={28} color="black" />
                </TouchableOpacity>
            </View>
        )
    };
};

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: true }}>
            <Drawer.Screen name="Home" component={TabNavigator} options={{
                ...CustomHeader({ title: "Home" }),
                drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
            }} />
            <Drawer.Screen name="Help" children={() => <WebViewScreen screenName={"Help"} uri="https://support.google.com" />} options={{
                ...CustomHeader({ title: "Help" }),
                drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />,
            }} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
