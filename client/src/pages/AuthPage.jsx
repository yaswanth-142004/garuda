import React from "react";
import { FcGoogle } from "react-icons/fc"; 
import { auth } from "../lib/firebaseConfig"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import { FollowerPointerCard } from '@/components/ui/Pointer'

const SignIn = () => {
  const navigate = useNavigate(); 

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      // Redirect to /dashboard after successful sign-in
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      navigate("/login")
    }
  };

  return (
    <FollowerPointerCard>
    <div className="flex flex-col justify-center items-center bg-zinc-950 min-h-screen pb-5">
    
      <div className="mx-auto flex w-full flex-col justify-center px-5 md:max-w-[50%] lg:max-w-[50%]">
        <a className="mt-10 w-fit text-white" href="/">
          <div className="flex w-fit items-center">
            <svg
              stroke="currentColor"
              fill="currentColor"
              viewBox="0 0 320 512"
              className="mr-3 h-[13px] w-[8px] text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            <p className="text-sm text-white">Back to the website</p>
          </div>
        </a>
        <div className="mt-8 flex flex-col mx-auto w-[350px] max-w-[450px]">
          <p className="text-[32px] font-bold text-white">Sign In</p>
          <p className="mt-2.5 text-zinc-400">Enter your email and password to sign in!</p>
          <div className="mt-8">
            <button
              onClick={handleGoogleSignIn} // Attach the sign-in handler
              className="flex items-center justify-center w-full text-white py-3 border border-zinc-800 hover:bg-accent"
            >
              <FcGoogle className="mr-2 text-xl" /> 
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
   
    </div>
    </FollowerPointerCard>
  );
};

export default SignIn;
