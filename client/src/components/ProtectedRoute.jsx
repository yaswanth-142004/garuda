import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../lib/firebaseConfig"; // Import Firebase Auth
import { useAuthState } from "react-firebase-hooks/auth"; // Optional: Firebase hooks for cleaner state management

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth); // Get the current user and loading state

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;