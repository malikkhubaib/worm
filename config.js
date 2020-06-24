import Firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAVGL_voemAwpCQmnIkCghtrt6XIJ8egFE",
  authDomain: "worm-8701c.firebaseapp.com",
  databaseURL: "https://worm-8701c.firebaseio.com",
  projectId: "worm-8701c",
  storageBucket: "worm-8701c.appspot.com",
  messagingSenderId: "132329432190",
  appId: "1:132329432190:web:0f615200b46a738617a42f",
  measurementId: "G-60R1TQ6FG6"
};
// Initialize Firebase
let app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();   
export const storage = app.storage("gs://worm-8701c.appspot.com")
export const auth = app.auth()