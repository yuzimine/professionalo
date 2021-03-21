import _ from 'lodash';
import firebase from 'firebase/app';
import propTypes from 'prop-types';
import 'firebase/firestore';
import 'firebase/auth';

/**
 * Firebase Firestore Database Read operation
 * 
 * @param {string} dbCol DB root collection
 * @param {string} dbDoc DB document
 * @param {string} dbDocCol DB document collection
 * @param {object} condition object consisting of { field:string, operator:string, value:string } for filtered search
 */
const firestoreRead = (dbCol, dbDoc, dbDocCol, condition) => {
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

  return firebase.auth().signInWithEmailAndPassword(
    process.env.SECRET_ADMIN_NAME, process.env.SECRET_ADMIN_PASSWORD)
  .then(() => {
    let ref = firebase.firestore().collection(dbCol);
    if (dbDoc) ref = ref.doc(dbDoc);
    if (dbDocCol) ref = ref.collection(dbDocCol);
    if (condition) {
      _.forEach(condition, c => {
        ref = ref.where(c.field, c.operator, c.value);
      });
    }
    
    return ref.get()
      .then(doc => {
        if (doc.docs && doc.docs.length) {
          return _.map(doc.docs, d => d.data());
        } else if (doc.exists) {
          return doc.data();
        } else {
          console.log(`Firebase read document ${dbDoc} does not exist`);
          return null;
        }
    })
      .catch(error => {
        console.log('Firebase read error');
        return error;
      });
  })
  .catch(error => {
    console.log('Firebase login error:', error);
    return error;
  });

};

export default firestoreRead;

firestoreRead.propTypes = {
  dbCol: propTypes.string.isRequired,
  dbDoc: propTypes.string.isRequired,
  dbDocCol: propTypes.string,
  condition: propTypes.array,
};