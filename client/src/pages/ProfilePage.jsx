import React, { useState } from "react";
import PersonalInfo from "@/components/Profile/PersonalInfo";
import AcademicInfo from "@/components/Profile/AcademicInfo";
import ProjectsInfo from "@/components/Profile/ProjectsInfo";
import SkillInfo from "@/components/Profile/SkillInfo";
import WorkInfo from "@/components/Profile/WorkInfo";
import CertificationInfo from "@/components/Profile/CertificationInfo";
import AchievementInfo from "@/components/Profile/AchievementInfo";
import PublicationInfo from "@/components/Profile/PublicationInfo";
import SocialInfo from "@/components/Profile/SocialInfo";
import { UserPen, School, FolderGit2, Brain, Building2, ScrollText, FileBadge, Trophy, Link } from "lucide-react";

const tabs = [
  { name: "Personal Info", component: <PersonalInfo />, icon: <UserPen /> },
  { name: "Academic Info", component: <AcademicInfo />, icon: <School /> },
  { name: "Projects", component: <ProjectsInfo />, icon: <FolderGit2 /> },
  { name: "Skills", component: <SkillInfo />, icon: <Brain /> },
  { name: "Work Experience", component: <WorkInfo />, icon: <Building2 /> },
  { name: "Certifications", component: <CertificationInfo />, icon: <FileBadge /> },
  { name: "Achievements", component: <AchievementInfo />, icon: <Trophy /> },
  { name: "Publications", component: <PublicationInfo />, icon: <ScrollText /> },
  { name: "Social Links", component: <SocialInfo />, icon: <Link /> },
];

function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex px-4 h-[calc(100vh-6rem)]">
      {/* Sidebar Tabs */}
      <div className="w-1/4 space-y-4 sticky top-16 z-50">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`block w-full text-left p-2 rounded-lg transition-all ${
              activeTab === index ? "bg-accent text-accent-foreground" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            <div className="flex items-center">
              <div className="mr-2">{tab.icon}</div>
              <span>{tab.name}</span>
            </div>
            {/* {tab.name} */}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="w-3/4 px-4 flex justify-center  overflow-y-auto">
        {tabs[activeTab].component}
      </div>
    </div>
  );
}

export default ProfilePage;