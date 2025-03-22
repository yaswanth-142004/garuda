import React from "react";
import ToggleTheme from "../ToggleTheme";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full h-16 flex justify-end items-center border-b px-8 py-4 fixed top-0 ">
      
      <div className="ml-4 flex gap-4">
        <Button variant="secondary">
          <Link to="/auth">Login</Link>
        </Button>
        <ToggleTheme />
      </div>
    </div>
  );
};

export default Navbar;
