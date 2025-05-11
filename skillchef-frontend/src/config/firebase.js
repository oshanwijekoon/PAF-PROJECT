import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCSVTjf_FXNPo9KHGv_NUvouSK5zaVe-8Y",
    authDomain: "agri-app-4b149.firebaseapp.com",
    projectId: "agri-app-4b149",
    storageBucket: "agri-app-4b149.appspot.com", // Fix storage bucket URL
    messagingSenderId: "859703290877",
    appId: "1:859703290877:web:97919586d120ff6e9b0794",
    measurementId: "G-2M379462NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);