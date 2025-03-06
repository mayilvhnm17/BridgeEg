import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../util/navigationRef';

//Can add all the necessary native functionality here

//JSON structure
interface FileResponse {
    uri?: string;
    error?: string;
    base64?: string;  // Optional base64 string for the image
    blob?: Blob;  // Optional Blob for the image
    message?:string
}

//Camera permission
const requestPermissions = async (): Promise<boolean> => {
    const platform = Platform.OS;

    try {
        if (platform === 'android') {
            const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
            return cameraStatus === RESULTS.GRANTED;
        } else if (platform === 'ios') {
            const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
            return cameraStatus === RESULTS.GRANTED;
        }

        return false;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const convertUriToBase64 = async (uri: string): Promise<string | null> => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob); // This converts the blob to Base64
        });
    } catch (error) {
        console.error('Error converting URI to Base64:', error);
        return null;
    }
};

const convertUriToBlob = async (uri: string): Promise<Blob | null> => {
    try {
        const response = await fetch(uri);
        return await response.blob();
    } catch (error) {
        console.error('Error converting URI to Blob:', error);
        return null;
    }
};

export const pickFile = async (useBase64: boolean = false): Promise<FileResponse> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
        return { error: 'Permission denied for accessing files' };
    }
    try {
        const res = await pick({ type: ['images'] });
        if (res.uri) {
            let image: FileResponse = { uri: res.uri };
            if (useBase64) {
                const base64 = await convertUriToBase64(res.uri);
                if (base64) image.base64 = base64;
            } else {
                const blob = await convertUriToBlob(res.uri);
                if (blob) image.blob = blob;
            }
            return image;
        }
        return { error: 'No image selected' };
    } catch (err: any) {
        return { error: err.message };
    }
}

export const openCamera = async (useBase64: boolean = false): Promise<FileResponse> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
        return { error: 'Permission denied for accessing camera' };
    }
    return new Promise((resolve) => {
        launchCamera({ mediaType: 'photo', quality: 1 }, async (response) => {
            if (response.didCancel) {
                resolve({ error: 'User cancelled' });
            } else if (response.errorMessage) {
                resolve({ error: response.errorMessage });
            } else {
                const uri = response.assets?.[0]?.uri;
                if (uri) {
                    let image: FileResponse = { uri };
                    if (useBase64) {
                        const base64 = await convertUriToBase64(uri);
                        if (base64) image.base64 = base64;
                    } else {
                        const blob = await convertUriToBlob(uri);
                        if (blob) image.blob = blob;
                    }
                    resolve(image);
                } else {
                    resolve({ error: 'No image selected' });
                }
            }
        });
    });
}

export const openImagePicker = async (useBase64: boolean = false): Promise<FileResponse> => {
    const options = {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
    };
    return new Promise((resolve) => {
        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                resolve({ error: 'User cancelled image picker' });
            } else if (response.errorCode) {
                resolve({ error: response.errorMessage });
            } else {
                const uri = response.assets?.[0]?.uri;
                if (uri) {
                    let image: FileResponse = { uri };
                    if (useBase64) {
                        const base64 = await convertUriToBase64(uri);
                        if (base64) image.base64 = base64;
                    } else {
                        const blob = await convertUriToBlob(uri);
                        if (blob) image.blob = blob;
                    }
                    resolve(image);
                } else {
                    resolve({ error: 'No image selected' });
                }
            }
        });
    });
};

const allowedScreens = ['Home', 'Help', 'PWA 1', "PWA 2"];

export const navigateToTab = async (screenName: string): Promise<FileResponse> => {
    console.log(screenName);
    return new Promise((resolve) => {
        if (navigationRef.isReady() && allowedScreens.includes(screenName)) {
           
            navigationRef.navigate(screenName);
            let navRes: FileResponse = { message:"success" };
            resolve(navRes);
        } else
        resolve({ error: 'Navigation Error' });
    })
};
