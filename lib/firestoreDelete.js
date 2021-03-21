import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

/**
 * Firebase Firestore delete operation
 * 
 * @param {string} dbCol Collection name
 * @param {string} dbDoc Document name
 * @param {string} dbDocCol Document collection name
 * @param {string} dbDocColDoc The ID of the document to be deleted
 */
const firestoreDelete = (dbCol, dbDoc, dbDocCol, dbDocColDoc) => {
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
    let call = firebase.firestore().collection(dbCol).doc(dbDoc);
    if (dbDocCol) {
      call = call.collection(dbDocCol);
      if (dbDocColDoc) {
        call = call.doc(dbDocColDoc); // overwrite existing data
      }
    }
    call = call.delete(); // add a new entry
    return call
    .then(() => {})
    .catch(error => {
      console.log('Firestore delete error');
      return error;
    });
  })
  .catch(error => {
    console.log('Firestore login error:', error);
    return error;
  });

};

export default firestoreDelete;