import _ from 'lodash';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import propTypes from 'prop-types';

const firebaseInit = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Firebase Firestore Add/Update operation
 * 
 * @param {string} dbCol Collection name
 * @param {string} dbDoc Document name
 * @param {string} dbDocCol Document collection name
 * @param {object} dbData Data to be written in
 * @param {bool} dbMethod true = update, false = add
 */
const firestoreWrite = (dbData, dbCol, dbDoc, dbDocCol, dbDocColDoc) => {
  if (!firebase.apps.length) firebase.initializeApp(firebaseInit);

  return firebase.auth().signInWithEmailAndPassword(
    process.env.SECRET_ADMIN_NAME, process.env.SECRET_ADMIN_PASSWORD)
  .then(() => {
    let call = firebase.firestore().collection(dbCol);
    if (dbDoc) call = call.doc(dbDoc);
    if (dbDocCol) {
      call = call.collection(dbDocCol)
      if (dbDocColDoc) call = call.doc(dbDocColDoc).set(dbData);
      else call = call.add(dbData);
    } else {
      call = call.set(dbData);
    }
    return call
    .then((reply) => {
      return _.has(reply, 'id') ? reply.id : 'success';
    })
    .catch(error => {
      console.log('Firestore write error');
      return error;
    });
  })
  .catch(error => {
    console.log('Firestore login error:', error);
    return error;
  });

};

export default firestoreWrite;

firestoreWrite.propTypes = {
  dbData: propTypes.object,
  dbCol: propTypes.string,
  dbDoc: propTypes.string,
  dbDocCol: propTypes.string,
  dbDocColDoc: propTypes.string,
};