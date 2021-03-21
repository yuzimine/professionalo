import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

/**
 * Firebase Realtime Database Write operation
 * 
 * @param {string} dbRef Path of the target DB
 * @param {string} dbData Data to store
 */
const firebaseWrite = (dbRef, dbData) => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }

  return firebase.auth().signInWithEmailAndPassword(process.env.SECRET_ADMIN_NAME, process.env.SECRET_ADMIN_PASSWORD)
  .then(() => {
    return firebase.database().ref(dbRef).set(dbData)
    .then(() => {
      return "success";
    })
    .catch(error => {
      console.log('Firebase write error');
      return error;
    });
  })
  .catch(error => {
    console.log('Firebase login error:', error);
    return error;
  });

};

export default firebaseWrite;