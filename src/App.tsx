import React from 'react';
import HomePage from './pages';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC8eyXRMA6wd1-HewAzvECluMrSTuD6fDc",
  authDomain: "halogen-trilogy-382611.firebaseapp.com",
  projectId: "halogen-trilogy-382611",
  storageBucket: "halogen-trilogy-382611.appspot.com",
  messagingSenderId: "348330060852",
  appId: "1:348330060852:web:55b28a2822cbc45bd42e61"
};
const app = initializeApp(firebaseConfig);

function App() {
  return (
    <HomePage />
  );
}

export default App;
