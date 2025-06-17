/* eslint-disable no-unused-vars */
import React,{ useState } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, Clock, GitBranch, Coffee, Code, Zap, DoorOpen,Activity, Users, Crown, UserCircle2, OptionIcon } from "lucide-react";
import { ArrowUp, Armchair, Search, User, X } from 'lucide-react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
export default function AdminSidebar({socket}){
    
  const [stats, setStats] = useState({
    hoursWorked: 0,
    gitPushes: 0,
    coffeeBreaks: 0,
    linesOfCode: 0,
  });


    const updateStats = (newStats) => {
    setStats(prevStats => ({
      ...prevStats,
      ...newStats
    }));
  };

    const [onlinePlayers, setOnlinePlayers] = useState([
    { id: 1, name: "DevLead", status: "active", avatar: "👨‍💻", isHost: true },
    { id: 2, name: "CodeNinja", status: "busy", avatar: "🥷", isHost: false },
    { id: 3, name: "DesignDiva", status: "away", avatar: "👩‍🎨", isHost: false },
    { id: 4, name: "DataScientist", status: "active", avatar: "🧪", isHost: false },
    { id: 5, name: "FrontendWiz", status: "active", avatar: "✨", isHost: false },
  ]);

    const handleExit = () => {
    socket.emit('leaveRoom');
    // Save progress or handle any cleanup
    window.location.href = '/metaverse';
  };
   
  return (<>
  <div className="flex-1 flex flex-col bg-background border-l border-border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Office Dashboard</h2>

            </div>
          </div>


          <div className="flex-1 overflow-auto p-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Stats</CardTitle>
                <CardDescription>Your virtual work metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Hours Worked</span>
                  </div>
                  <span className="font-medium">{stats.hoursWorked}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-primary" />
                    <span>Git Pushes</span>
                  </div>
                  <span className="font-medium">{stats.gitPushes}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-primary" />
                    <span>Coffee Breaks</span>
                  </div>
                  <span className="font-medium">{stats.coffeeBreaks}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>Lines of Code</span>
                  </div>
                  <span className="font-medium">{stats.linesOfCode}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-3 w-3" />
                    <span>You joined the office space</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-3 w-3" />
                    <span>Work day started</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Online Players</span>
                  </div>
                  <Badge variant="outline">{onlinePlayers.length}</Badge>
                </CardTitle>
                <CardDescription>People in this office space</CardDescription>
              </CardHeader>
             
            </Card>
          </div>

          <div className="p-4 border-t mt-auto">
            <Button className="w-full" variant="destructive" onClick={handleExit}>
              Exit Office
            </Button>
          </div>
        </div>
  </>)

}