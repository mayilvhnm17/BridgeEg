import React, { useRef } from "react";
import { SafeAreaView, Text } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { navigationRef } from "./util/navigationRef";
//No updates in here if there is any additional functional additions. we add functions in bridgeFunctions and map the
//  functions to the respective webcall in the rpcBridge.ts
const App: React.FC = () => {
  const webviewRef = useRef<WebView | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer  ref={navigationRef}>
        <DrawerNavigator/>
      </NavigationContainer>
      
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;