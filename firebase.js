 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
  import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
  } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCyUjiivS4QJpPH3I5-RbTPog_fkBf3wek",
    authDomain: "sumi-ai-49675.firebaseapp.com",
    projectId: "sumi-ai-49675",
    storageBucket: "sumi-ai-49675.firebasestorage.app",
    messagingSenderId: "700640254409",
    appId: "1:700640254409:web:b69b65fb63700ff61b7018",
    measurementId: "G-8WP1V6DTZ1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  export { auth};
  
  function signup() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Signup Successful");
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  
  function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Login Successful");
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  
  window.signup = signup;
  window.login = login;
  onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    if (window.location.pathname.includes("index.html")) {
      window.location.href = "login.html";
    }
  }
});
function logout() {
  signOut(auth)
    .then(() => {
      alert("Logged out");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

window.logout = logout;
