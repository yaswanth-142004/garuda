import React from "react";
import ToggleTheme from "./ToggleTheme";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="w-full h-16 flex justify-between items-center border-b bg-background px-6 py-4 shadow-sm">
      {/* Logo */}
      <div className="w-20 h-auto flex items-center">
        <img src={Logo} alt="Company Logo" className="w-full" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="Home">
        <TabsList>
          <TabsTrigger value="Home">
            <Link to="./">Home</Link>
          </TabsTrigger>
          <TabsTrigger value="Resume">Resume</TabsTrigger>
          <TabsTrigger value="Cover Letter">Cover Letter</TabsTrigger>
          <TabsTrigger value="Resources">Resources</TabsTrigger>
          <TabsTrigger value="Interview Prep">Interview Prep</TabsTrigger>
          <TabsTrigger value="Extension">Extension</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Right Side: Theme Toggle & Avatar */}
      <div className="flex items-center gap-6">
        <ToggleTheme />
        <Link to="./profile">
          <Avatar
            className="cursor-pointer rounded-full"
            aria-label="User Profile"
          >
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
