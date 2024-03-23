import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Logout Error:", error);
        navigate("/");
      }
    };

    performLogout();
  }, [navigate]);

  return null;
};

export default SignOut;
