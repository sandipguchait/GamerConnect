import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// copying from firebase 
var config = {
    apiKey: "AIzaSyCweDf3vjKj6IMLjw9IWNs1bNlNJg4TI7s",
    authDomain: "gamerconnect-e7cbb.firebaseapp.com",
    databaseURL: "https://gamerconnect-e7cbb.firebaseio.com",
    projectId: "gamerconnect-e7cbb",
    storageBucket: "gamerconnect-e7cbb.appspot.com",//copying from storage
    messagingSenderId: "1091838455194"
  };
  firebase.initializeApp(config);

  export default firebase;