<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";

  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";

  const firebaseConfig = {
    apiKey: "AIzaSyACJmi_CMBLGiQYEGaqxQCA6q1AHIVNS1c",
    authDomain: "glonex.firebaseapp.com",
    projectId: "glonex",
    storageBucket: "glonex.appspot.com",
    messagingSenderId: "931476817823",
    appId: "1:931476817823:web:313d7bb5d624bbf1cf9faa",
    measurementId: "G-CBS7EBS1YD",
  };

  firebase.initializeApp(firebaseConfig);

  import Globe from "./Globe.svelte";
  import Checkbook from "./Checkbook.svelte";

  let googleProvider = new firebase.auth.GoogleAuthProvider();
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="initial-scale=1, maximum-scale=1,user-scalable=no"
  />
  <link
    rel="stylesheet"
    href="https://js.arcgis.com/4.18/esri/themes/light/main.css"
  />
  <script src="https://js.arcgis.com/4.18/"></script>
  <script
    src="https://developers.arcgis.com/javascript/latest/sample-code/satellites-3d/live/satellite.js"></script>
  <style>
    html,
    body,
    #viewDiv {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
    }
  </style>
</svelte:head>
<main>
  <!-- 1. 🔥 Firebase App -->
  <FirebaseApp {firebase}>
    <User persist={sessionStorage} let:user let:auth>
      <em>{user.uid}</em>

      <button on:click={() => auth.signOut()}>Sign Out</button>
      <Checkbook />
      <Globe />

      <div slot="signed-out">
        <button on:click={() => auth.signInAnonymously()}>
          Sign In Anonymously
        </button>
        <button on:click={() => auth.signInWithPopup(googleProvider)}>
          Sign In With Google
        </button>
        <Checkbook />
        <Globe />
      </div>
    </User>
  </FirebaseApp>
</main>
