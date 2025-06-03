/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import OfficeMapScene from '../../hooks/officeMap';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Clock, GitBranch, Coffee, Code, Zap, Activity, Users, Crown, UserCircle2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import io from "socket.io-client";
const socket = io(backendUrl);


export default function PhaserGame({roomId}) {
  const gameRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChairDialog, setShowChairDialog] = useState(false);
  const [showArrow, setShowArrow] = useState(true);


  const [stats, setStats] = useState({
    hoursWorked: 0,
    gitPushes: 0,
    coffeeBreaks: 0,
    linesOfCode: 0,
  });
  
  // Sample online players data
  const [onlinePlayers, setOnlinePlayers] = useState([
    { id: 1, name: "DevLead", status: "active", avatar: "👨‍💻", isHost: true },
    { id: 2, name: "CodeNinja", status: "busy", avatar: "🥷", isHost: false },
    { id: 3, name: "DesignDiva", status: "away", avatar: "👩‍🎨", isHost: false },
    { id: 4, name: "DataScientist", status: "active", avatar: "🧪", isHost: false },
    { id: 5, name: "FrontendWiz", status: "active", avatar: "✨", isHost: false },
  ]);

  // This function would be called from your game scene to update stats
  const updateStats = (newStats) => {
    setStats(prevStats => ({
      ...prevStats,
      ...newStats
    }));
  };
useEffect(() => {
  // Get all assigned chairs from localStorage
  let assignedChairs = {};
  try {
    assignedChairs = JSON.parse(localStorage.getItem('assignedChairIds')) || {};
  } catch (e) {
    assignedChairs = {};
  }
  // If there is no chair for this room, show the dialog
  if (!assignedChairs[roomId]) {
    setShowChairDialog(true);
  } else {
    setShowChairDialog(false);
  }
}, [roomId]);

  useEffect(() => {
    localStorage.setItem('roomId', roomId);

    socket.on('currentPlayersForFrontend',(players)=>{
      const existingPlayers=players.map((player)=>{
        return {
          id:player.id,
          name:player.username,
          status : 'active',
          isHost:false
        }
      })
     
    })
    socket.on('newPlayerInFrontend',({id,username,avatar})=>{
      const newPlayer= {
        id,
        name:username,
        status:'active',
        avatar:avatar,
        isHost:false
      }
    })

  },[roomId]);


  useEffect(() => {
    if (!gameRef.current) {
      const container = document.getElementById('phaser-container');
      const assignedChairs = JSON.parse(localStorage.getItem('assignedChairIds')) || {};
      const assignedChairId = assignedChairs[roomId] || null;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: container.clientWidth,
        height: container.clientHeight,
        parent: 'phaser-container',
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
        scene: [OfficeMapScene],
        socket,
        scale: {
          mode: Phaser.Scale.NONE, // we will size it manually
          autoCenter: Phaser.Scale.NO_CENTER,
        },
      });
      gameRef.current.scene.start('OfficeMapScene', { socket ,assignedChairId,showArrow, updateStats });

      // Handle window resize to make game responsive
      const handleResize = () => {
        if (gameRef.current) {
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          gameRef.current.scale.resize(newWidth, newHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        gameRef.current?.destroy(true);
        gameRef.current = null;
      };
    }
  }, [roomId]);

  useEffect(() => {
  if (gameRef.current) {
    const scene = gameRef.current.scene.getScene('OfficeMapScene');
    if (scene && scene.data) {
      scene.data.set('showArrow', showArrow);
    }
  }
}, [showArrow]);
  const handleChairSelection = async () => {
    const response = await fetch(`${backendUrl}/api/assign-chairs`,{
      method:"POST",
      headers:{  "Content-Type": "application/json",},
      body:JSON.stringify({
        spaceId: roomId
      }),
      credentials:'include'
    });
    if(!response.ok){
      alert('something is wrong');
    }
    const result = await response.json();
    console.log(result)
      // Get existing assignments or initialize
  let assignedChairs = {};
  try {
    assignedChairs = JSON.parse(localStorage.getItem('assignedChairIds')) || {};
  } catch (e) {
    assignedChairs = {};
  }
  // Set/update the chair for this room
  assignedChairs[roomId] = result.assignedChairId;
  localStorage.setItem('assignedChairIds', JSON.stringify(assignedChairs));


    setShowChairDialog(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Allow the state to update before resizing
    setTimeout(() => {
      const container = document.getElementById('phaser-container');
      if (gameRef.current) {
        gameRef.current.scale.resize(container.clientWidth, container.clientHeight);
      }
    }, 100);
  };

  const handleExit = () => {
    socket.emit('leaveRoom');
    // Save progress or handle any cleanup
    window.location.href = '/metaverse';
  };

  return (
    <div className="flex h-screen w-screen bg-black">
      {/* Game Container */}
      <div
        id="phaser-container"
        className={`relative ${isFullscreen ? 'w-full' : 'flex-3'} h-full overflow-hidden border-8 border-primary/40 rounded-xl`}
        style={{ flex: isFullscreen ? '1' : '3' }}
      >
        <div>
  {/* Fullscreen toggle button */}
  <Button 
    variant="outline" 
    size="icon" 
    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
    onClick={toggleFullscreen}
  >
    <Zap className="h-4 w-4" />
  </Button>
  {/* Arrow toggle button, positioned right below the fullscreen button */}
  <Button
    variant={showArrow ? "default" : "outline"}
    size="icon"
    className="absolute right-4 top-16 bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
    onClick={() => setShowArrow((prev) => !prev)}
    title={showArrow ? "Hide Arrow" : "Show Arrow"}
  >
    <img src="/arrows/arrow.png" alt="Arrow" className="h-5 w-5" />
  </Button>
</div>
        {/* Fullscreen toggle button - absolute positioned over the game */}
      

         {/* Chair Chooser Dialog */}
        {showChairDialog && (
          <div
            className="absolute top-6 right-6 z-20 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64"
            style={{ minHeight: '120px' }}
          >
            <h3 className="font-bold mb-2 text-blue-400">Choose Your Chair</h3>
            <div className="flex flex-wrap gap-2 mb-3 text-black">
              Click here to get your chair 
            </div>
            <Button
              className="w-full"
              onClick={() => handleChairSelection()}
            >
              show
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      {!isFullscreen && (
        <div className="flex-1 flex flex-col bg-background border-l border-border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Office Dashboard</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleExit}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
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
              <CardContent className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {onlinePlayers.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`h-8 w-8 rounded-full bg-${player.status === 'active' ? 'green' : player.status === 'busy' ? 'red' : 'yellow'}-100 flex items-center justify-center`}>
                          <span className="text-xl">{player.avatar}</span>
                        </div>
                        <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full bg-${player.status === 'active' ? 'green' : player.status === 'busy' ? 'red' : 'amber'}-500 ring-1 ring-background`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium">{player.name}</p>
                          {player.isHost && <Crown className="h-3 w-3 text-amber-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">{player.status}</p>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <UserCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="p-4 border-t mt-auto">
            <Button className="w-full" variant="destructive" onClick={handleExit}>
              Exit Office
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}