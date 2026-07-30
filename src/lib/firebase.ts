import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyChBwgg01Z1iUae46LQ05BXy_is2Vg-oLg",
  authDomain: "women-app-72ede.firebaseapp.com",
  projectId: "women-app-72ede",
  storageBucket: "women-app-72ede.firebasestorage.app",
  messagingSenderId: "341548834022",
  appId: "1:341548834022:web:8565957dd0c1f8135cef27",
  measurementId: "G-49VXT04XZZ"
};

const app = initializeApp(firebaseConfig);
const messaging = typeof window !== 'undefined' && 'serviceWorker' in navigator ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, { 
      vapidKey: 'BP6zfa7ZoKqUJsbVWNbTOkTOQQ7z1zmS45NwR2ASxS2iMesPZORbL_5sqTnRojWNrh1-tXIOxUJDuVSxpVPjF_c' 
    });
    if (currentToken) {
      console.log('FCM Token generated:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return;
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export { app, messaging };
