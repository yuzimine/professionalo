import propTypes from 'prop-types';
import { useState, useEffect, createContext, useContext } from 'react';
import { Provider } from 'next-auth/client';
import __ from 'i18next';
import Cookies from 'js-cookie';
import moment from 'moment-timezone';

import firebase from 'firebase/app';
import 'firebase/auth';

import ja from 'languages/ja.json';
import en from 'languages/en.json';

export const UserContext = createContext();


const UserContextComp = ({ pageProps, children }) => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(Cookies.get('LANGUAGE') || 'en');
  const [tz, setTz] = useState(Cookies.get('TZ') || moment.tz.guess());

  __.init({
    lang,
    fallbackLng: ['en', 'ja'],
    keySeparator: '|',
    resources: { ja, en },
  });

  __.changeLanguage(lang);

  console.log("Context[3]: set language cookie -- ", lang);
  Cookies.set('LANGUAGE', lang);
  
  console.log("Context[3]: set timezone cookie -- ", tz);
  Cookies.set('TZ', tz);

  useEffect(() => {
    console.log("Context[1]: initialize firebase app");
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
    // Listen authenticated user
    const unsubscriber1 = firebase.auth().onAuthStateChanged((user) => {
      console.log("Context[4]: auth state change -- ", user);
      if (user) {
        // User is signed in.
        const { uid, displayName, email, photoURL } = user;
        // You could also look for the user doc in your Firestore (if you have one):
        // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
        setUser({ uid, displayName, email, photoURL });
      } else {
        setUser(null);
      }
    });
    const unsubscriber2 = firebase.auth().onIdTokenChanged((user) => {
      console.log("Context[5]: id token change -- ", user);
      if (user) {
        // User is signed in.
      }
    });

    firebase.auth().signInWithEmailAndPassword('yuzimine@me.com', 'madison')
    .then((/* user */) => {
      // User is logged in to Firebase
    })
    .catch(error => console.log('Firebase login error:', error));

    // Unsubscribe auth listener on unmount
    return () => {
      console.log("Context[6]: unsubscribe firebase auth");
      unsubscriber1();
      unsubscriber2();
    };
  }, []);

  useEffect(() => {
    console.log("Context[2]: recurring initialization of firebase");
    const handle = setInterval(async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, lang, setLang, tz, setTz }}>
      <Provider session={pageProps.session}>
        {children}
      </Provider>
    </UserContext.Provider>
  );
};

UserContextComp.propTypes = {
  pageProps: propTypes.object,
  children: propTypes.object.isRequired,
};

export default UserContextComp;
// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
