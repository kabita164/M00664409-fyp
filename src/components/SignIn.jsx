import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SignInView = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="sign-in-view">
      <h2>Sign In</h2>
      <button onClick={handleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default SignInView;
