import WebView, { WebViewMessageEvent } from "react-native-webview";
import { navigateToTab, openCamera, openImagePicker, pickFile } from "./bridgeFunctions";
import { MutableRefObject } from "react";

//Params can be anything and optional if we want to send data or anything for that 
// !Need some work on multiple params!
interface RPCMessage {
    id: number;
    method: string;
    params?: any;
}

interface RPCResponse {
    id: number;
    result: any | null;
    error?: string | null;
}

interface messageToPWA {
    method?: string,
    message?: string,
    error?: string,
    payload?: any,
    route?:string
}

// Store WebView references with a unique key
const webViewRefs: Map<string, MutableRefObject<WebView | null>> = new Map();

// Function to register a WebView
export const registerWebView = (key: string, ref: MutableRefObject<WebView | null>) => {
    webViewRefs.set(key, ref);
};

// Function to remove a WebView when unmounted
export const unregisterWebView = (key: string) => {
    webViewRefs.delete(key);
};

//Function mapper
const rpcMethods: Record<string, (params?: any) => Promise<any>> = {
    FilePicker: pickFile,
    Camera: openCamera,
    ImagePicker: openImagePicker,
    HelloWorld: async () => { return "Hello from React Native!" },
    Navigate: navigateToTab,
};


//If we get message from PWA we send a response to indicate the communication has happend everytime, kind of like an
export const handleRPCMessage = async (event: WebViewMessageEvent, screen: string, sendToWebView: (screen: string, message: RPCResponse) => void): Promise<void> => {
    try {
        const dataPayload = JSON.parse(event.nativeEvent.data);
        if (dataPayload) {
            if (dataPayload.type === "log") {
                console.log(`[PWA] ${JSON.stringify(dataPayload.message)}`);
            } else {
                const { id, method, params }: RPCMessage = JSON.parse(event.nativeEvent.data);


                console.log(id, method, params);
                let response: RPCResponse = { id, result: null, error: null };
                if (rpcMethods[method]) {

                    response.result = await rpcMethods[method](params);

                } else {
                    response.error = `Unknown method:${method}`;
                }
                //sending response
                console.log("Res", screen, response);
                sendToWebView(screen, response);
            }
        }
    }
    catch (err) {
            console.error("RPC error", err);
        }
    }


//We can use this to send data to the PWA(For now navigating inside PWA, which can be ported to redirection from email/pushnotif/notif)
export const sendToWebView = (key: string, message: RPCResponse | messageToPWA): void => {
        console.log("Message sent to", key, "with data:", JSON.stringify(message));
        const webViewRef = webViewRefs.get(key);
        if (webViewRef?.current) {

            webViewRef.current.injectJavaScript(`window.postMessage(${JSON.stringify(message)},'*')`)
            console.log("Sent");
        }
    }