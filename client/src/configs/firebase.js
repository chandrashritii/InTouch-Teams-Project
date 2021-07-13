import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import 'firebase/functions';
import { isLocalhost } from './helpers';
import { Notification as Toast } from 'rsuite';

const config = {
  apiKey: "AIzaSyAsVD_C7K44THRKg1N3z90kWqhIImPuZnA",
    authDomain: "lastchance-64156.firebaseapp.com",
    databaseURL: "https://lastchance-64156-default-rtdb.firebaseio.com",
    projectId: "lastchance-64156",
    storageBucket: "lastchance-64156.appspot.com",
    messagingSenderId: "986678897419",
    appId: "1:986678897419:web:7fad3f6acf86fa0697100e"

};

// instance of firebase app
const app = firebase.initializeApp(config);

// auth for Facebook and Google
export const auth = app.auth();

export const database = app.database();

export const storage = app.storage();

export const functions = app.functions('nam5(us-central)');

 export const messaging = firebase.messaging()
 ? app.messaging()
 : null;

 // if (messaging) {
//   messaging.getToken({
//     vapidKey:
//       'BJ_lFbdq1RmUrKGgv4RD57-9_UstBgLx1EKm3rd2G43WK2qlPfT91e_5WhXJYcEOyfOg_EyfTVnzK_NeMAOT_r8',
//   });

  // foreground
  messaging.onMessage(({ notification }) => {
    // console.log(data);
    const { title, body } = notification;
    Toast.info({ title, description: body, duration: 0 });
  });

if (isLocalhost) {
  functions.useFunctionsEmulator('http://localhost:5001');
}