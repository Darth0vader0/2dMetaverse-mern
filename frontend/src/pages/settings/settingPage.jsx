"use client";

import { useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { PageBackground } from "../../components/page-background";
import ProfilePage from "./profilePage";
import AvatarCustomizationPage from "./avatarPage";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile"); // Track the active tab

  return (
    <PageBackground>
      <div className="flex min-h-screen">
        {/* Pass activeTab and setActiveTab as props to Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-4">
          {/* Render content based on activeTab */}
          {activeTab === "profile" && <ProfilePage />}
          {activeTab === "avatar" && <AvatarCustomizationPage />}
        </div>
      </div>
    </PageBackground>
  );
}