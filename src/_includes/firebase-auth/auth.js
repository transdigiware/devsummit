import firebase from 'firebase/app';
import firebaseConfig from './firebase.config';

import 'firebase/auth';
// import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);

export function onLoginStateChange(cb) {
  firebase.auth().onAuthStateChanged(cb);
}

export function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  firebase.auth().signInWithPopup(provider);
}

export function logout() {
  firebase.auth().signOut();
}
