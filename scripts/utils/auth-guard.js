import { auth, onAuthStateChanged } from "../modules/firebase.js";

export function requireAuth(redirectUrl = "./auth.html") {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
        reject(new Error("User not authenticated"));
      }
    });
  });
}

export function redirectIfAuthenticated(redirectUrl = "../index.html") {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = redirectUrl;
        reject(new Error("User already authenticated"));
      } else {
        resolve();
      }
    });
  });
}
