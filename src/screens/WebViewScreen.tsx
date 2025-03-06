import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { handleRPCMessage, registerWebView, sendToWebView, unregisterWebView } from "../bridge/rpcBridge";

const WebViewScreen = ({ uri,screenName }: { uri: string,screenName:string }) => {
    const webviewRef = useRef<WebView | null>(null);
    useEffect(() => {
      registerWebView(screenName, webviewRef);
      return () => unregisterWebView(screenName);
  }, [screenName]);
  return (
    <View style={styles.container}>
      <WebView source={{ uri }} 
       ref={webviewRef}
       javaScriptEnabled={true}
       domStorageEnabled={true}
       onMessage={(event: WebViewMessageEvent) =>
         handleRPCMessage(event,screenName,sendToWebView)
       }/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default WebViewScreen;
