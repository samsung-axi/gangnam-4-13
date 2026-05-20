// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FCM_API_KEY,
  authDomain: process.env.REACT_APP_FCM_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FCM_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FCM_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FCM_APP_ID,
  measurementId: process.env.REACT_APP_FCM_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestPermission() {
  console.log("알림 권한 요청 중");

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("알림 권한 승인 완료");
  } else {
    console.log("알림 권한 거절");
  }

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  });

  if (token) {
    console.log("토큰 발급 완료");
    console.log("token: ", token);
  } else {
    console.log("토큰 발급 실패");
  }

  onMessage(messaging, (payload) => {
    console.log("알림 수신", payload);
  });
  return token;
}