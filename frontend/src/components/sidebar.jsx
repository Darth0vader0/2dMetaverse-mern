"use client"

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, Volume2, Shield, LogOut, Menu } from "lucide-react";
import { cn } from "../libs/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const sidebarItems = [
    {
      name: "Profile",
      icon: User,
      path: "/settings",
    },
    {
      name: "Sound & Music",
      icon: Volume2,
      path: "/settings?tab=sound",
    },
    {
      name: "Privacy",
      icon: Shield,
      path: "/settings?tab=privacy",
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
            className={cn("w-full justify-start", location.pathname === item.path && "bg-muted")}
            onClick={() => {
              navigate(item.path);
              setOpen(false);
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
            navigate("/metaverse");
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
            navigate("/");
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