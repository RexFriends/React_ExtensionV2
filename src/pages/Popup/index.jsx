import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';

import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA0C_6O04biBpvVC579SBzGSUQ_IY2bF4I",
  authDomain: "rexfriends-dev.firebaseapp.com",
  projectId: "rexfriends-dev",
  storageBucket: "rexfriends-dev.appspot.com",
  messagingSenderId: "581619494498",
  appId: "1:581619494498:web:ec5b8f17fbfe63f1252b3b",
  measurementId: "G-MJ0ZRL7M0M"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
if (firebaseApp != null) {
  console.log('firebase app started successfully');
} else {
  console.log('firebase app failed to start');
}

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

render(<Popup />, window.document.querySelector('#app-container'));
