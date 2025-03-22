import React, { useEffect, useState } from "react";
import ToggleTheme from "./ToggleTheme";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { auth } from "../lib/firebaseConfig"; // Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import signOut
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

const Topbar = () => {
  const [user, setUser] = useState(null); // State to store the logged-in user
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the logged-in user
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/"); // Redirect to the landing page
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const words = [
    {
      text: "Garuda",
      className: "text-blue-500 dark:text-blue-500 text-2xl font-bold",
    },
  ];

  return (
    <div className="w-full h-16 flex justify-between items-center border-b bg-black px-6 py-4 shadow-sm">
      {/* Logo */}
      <div className="w-20 h-auto flex items-center">
        <TypewriterEffectSmooth words={words} className="ml-12" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="Home">
        <TabsList  className="bg-black">
          <TabsTrigger value="Home">
            <Link to="/dashboard">Home</Link>
          </TabsTrigger>
          <TabsTrigger value="Resume">
            <Link to="/resume">Resume</Link>
          </TabsTrigger>
          <TabsTrigger value="Resources">
            <Link to="/resources">Resources</Link>
          </TabsTrigger>
          <TabsTrigger value="Interview Prep">
            <Link to="/interview-prep">Interview Prep</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Right Side: Theme Toggle, Avatar, and Sign Out */}
      <div className="flex items-center gap-6 bg-black">
        <ToggleTheme />
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <Avatar
              className="cursor-pointer rounded-full"
              aria-label="User Profile"
            >
              {user && user.photoURL ? (
                <AvatarImage src={user.photoURL} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  {user && user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
          {user && (
            <button
              onClick={handleSignOut}
              className="text-sm text-red-500 hover:underline"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
