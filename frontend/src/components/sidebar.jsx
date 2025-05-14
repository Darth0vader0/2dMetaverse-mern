"use client";

import { User, UserRoundPen, Shield, Home, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "../libs/utils";

export function Sidebar({ activeTab, setActiveTab }) {
  const [open, setOpen] = useState(false);

  const sidebarItems = [
    {
      name: "Profile",
      icon: User,
      tab: "profile",
    },
    {
      name: "Avatar Customization",
      icon: UserRoundPen,
      tab: "avatar",
    },
    {
      name: "Privacy",
      icon: Shield,
  
    },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold">2D Metaverse</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              activeTab === item.tab && "bg-muted" // Highlight active tab
            )}
            onClick={() => {
              setActiveTab(item.tab); // Update activeTab state
              setOpen(false); // Close the sidebar (for mobile)
            }}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}

        <Button
          variant="ghost"
          className="w-full justify-start text-primary"
          onClick={() => {
            setActiveTab("metaverse"); // Example: Set a tab for "Join World"
            setOpen(false);
          }}
        >
          <Home className="mr-2 h-4 w-4" />
          Join World
        </Button>
      </nav>

      <div className="p-4 border-t mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => {
            setActiveTab("logout"); // Example: Handle logout tab
            setOpen(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  const MobileSidebar = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col h-full py-4">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopSidebar = () => (
    <div className="w-64 border-r bg-background/80 backdrop-blur-sm h-screen hidden md:flex flex-col sticky top-0">
      <SidebarContent />
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}