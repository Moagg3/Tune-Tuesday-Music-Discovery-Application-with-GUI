import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: ' AIzaSyDYhL8pXBqPyPR4PeYcNysVEwS9gY72FfA',
  authDomain: 'tune-tuesday.firebaseapp.com',
  databaseURL: 'https://tune-tuesday-default-rtdb.firebaseio.com/',
  projectId: 'tune-tuesday',
  storageBucket: 'tune-tuesday.appspot.com',
  messagingSenderId: '511284942576',
  appId: '1:511284942576:android:022abe3689f3dd1e335435',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };