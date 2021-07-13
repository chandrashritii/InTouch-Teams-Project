// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/7.22.0/firebase-app.js');
// importScripts(
//   'https://www.gstatic.com/firebasejs/7.22.0/firebase-messaging.js'
// );
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js'
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAsVD_C7K44THRKg1N3z90kWqhIImPuZnA",
  authDomain: "lastchance-64156.firebaseapp.com",
  databaseURL: "https://lastchance-64156-default-rtdb.firebaseio.com",
  storageBucket: "gs://lastchance-64156.appspot.com",
  projectId: "lastchance-64156",
  storageBucket: "lastchance-64156.appspot.com",
  messagingSenderId: "986678897419",
  appId: "1:986678897419:web:7fad3f6acf86fa0697100e"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging();
