/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import OfficeMapScene from '../../hooks/officeMap';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Clock, GitBranch, Coffee, Code, Zap, Activity, Users, Crown, UserCircle2 } from "lucide-react";
import { ArrowUp, Armchair, Search, User, X } from 'lucide-react';
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import io from "socket.io-client";
const socket = io(backendUrl);


export default function PhaserGame({ roomId }) {
  const gameRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChairDialog, setShowChairDialog] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const [showArrowOptions, setShowArrowOptions] = useState(false);
  const [findPersonInput, setFindPersonInput] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
const [exitPopupDismissed, setExitPopupDismissed] = useState(false);

// Make these available globally for Phaser to call
window.setShowExitModal = setShowExitModal;
window.setExitPopupDismissed = setExitPopupDismissed;

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


  // useEffect(() => {
  //   // On mount: check if we should redirect
  //   if (localStorage.getItem('redirectToMetaverse') === 'true') {
  //     localStorage.removeItem('redirectToMetaverse');
  //     window.location.href = '/metaverse';
  //     return;
  //   }

  //   const handleBeforeUnload = () => {
  //     socket.emit('leaveRoom');
  //     localStorage.setItem('redirectToMetaverse', 'true');
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);


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

    socket.on('currentPlayersForFrontend', (players) => {
      const existingPlayers = players.map((player) => {
        return {
          id: player.id,
          name: player.username,
          status: 'active',
          isHost: false
        }
      })

    })
    socket.on('newPlayerInFrontend', ({ id, username, avatar }) => {
      const newPlayer = {
        id,
        name: username,
        status: 'active',
        avatar: avatar,
        isHost: false
      }
    })

  }, [roomId]);


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
      gameRef.current.scene.start('OfficeMapScene', { socket, assignedChairId, showArrow, updateStats });

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

  const handleToggleArrow = () => {
    setShowArrow(prev => !prev);
    setShowArrowOptions(false);
  };

  const handleFindChair = () => {
    // Your existing chair finding logic here
    console.log("Finding chair...");
    setShowArrowOptions(false);
  };

  const handleFindPerson = () => {
    if (findPersonInput.trim()) {
      console.log(`Finding person: ${findPersonInput}`);
      setShowArrowOptions(false);
      setFindPersonInput("");
    }
  };


  const handleChairSelection = async () => {
    const response = await fetch(`${backendUrl}/api/assign-chairs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
        spaceId: roomId
      }),
      credentials: 'include'
    });
    if (!response.ok) {
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

    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('OfficeMapScene');
      if (scene && scene.data) {
        scene.data.set('assignedChairId', result.assignedChairId);
        // Optionally, also update the property directly for immediate effect:
        scene.assignedChairId = result.assignedChairId;
      }
    }

    setShowChairDialog(false)
  }

  // Remove Phaser keyboard listeners
  function detachPhaserKeyboard(scene) {
    if (scene && scene.input && scene.input.keyboard && scene.input.keyboard.manager) {
      scene.input.keyboard.manager.enabled = false;
    }
  }

  // Re-attach Phaser keyboard listeners
  function attachPhaserKeyboard(scene) {
    if (scene && scene.input && scene.input.keyboard && scene.input.keyboard.manager) {
      scene.input.keyboard.manager.enabled = true;
    }
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
            onClick={() => { setShowArrowOptions((true)); }}
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
        {showExitModal && (
  <div 
    style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "fadeIn 0.3s ease-out"
    }}
    onClick={(e) => e.target === e.currentTarget && setShowExitModal(false)}
  >
    <div 
      style={{
        background: "linear-gradient(145deg, #1e293b 0%, #334155 100%)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
        textAlign: "center",
        minWidth: "400px",
        maxWidth: "90vw",
        position: "relative",
        animation: "slideIn 0.3s ease-out",
        border: "1px solid rgba(99, 102, 241, 0.3)"
      }}
    >
      {/* Close button */}
      <button
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          fontSize: "24px",
          cursor: "pointer",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease"
        }}
        onClick={() => setShowExitModal(false)}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(148, 163, 184, 0.1)";
          e.target.style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "#94a3b8";
        }}
      >
        ×
      </button>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ 
          color: "#ffffff", 
          margin: "0 0 8px 0",
          fontSize: "28px",
          fontWeight: "700",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}>
          Choose Your Destination
        </h2>
        <p style={{ 
          color: "#94a3b8", 
          margin: 0,
          fontSize: "16px"
        }}>
          Select where you'd like to go
        </p>
      </div>

      {/* Buttons */}
      <div style={{ 
        display: "flex", 
        gap: "16px", 
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        {[
          { 
            label: "☕ Cafe", 
            color: "#059669", 
            hoverColor: "#047857",
            action: () => {
              setShowExitModal(false);
              // TODO: Load cafe map/scene
            }
          },
          { 
            label: "🏢 Meeting", 
            color: "#2563eb", 
            hoverColor: "#1d4ed8",
            action: () => {
              setShowExitModal(false);
              // TODO: Load meeting map/scene
            }
          },
          { 
            label: "Cancel", 
            color: "#64748b", 
            hoverColor: "#475569",
            action: () => {
              setShowExitModal(false);
              setExitPopupDismissed(true);
              window.setExitPopupDismissed(true);
            }
          }
        ].map((btn, index) => (
          <button
            key={index}
            style={{
              background: `linear-gradient(145deg, ${btn.color}, ${btn.hoverColor})`,
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              minWidth: "120px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden"
            }}
            onClick={btn.action}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "translateY(0) scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1)";
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>

    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
  </div>
)}
        {showArrowOptions && (
          <div className="absolute top-24 right-4 z-30 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-4 w-64">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-400 flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                Arrow Options
              </h3>
              <button
                onClick={() => { setShowArrowOptions(false); }}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Arrow Button */}
            <button
              className={`w-full mb-3 px-3 py-2 rounded-md border transition-all duration-200 flex items-center justify-center gap-2 ${showArrow
                ? "bg-purple-600 text-white border-purple-500 hover:bg-purple-700"
                : "bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600"
                }`}
              onClick={handleToggleArrow}
            >
              {showArrow ? (
                <>
                  <div className="relative">
                    <ArrowUp className="w-4 h-4" />
                    <X className="w-2 h-2 absolute -top-1 -right-1 text-red-500" />
                  </div>
                  Hide your arrow
                </>
              ) : (
                <>
                  <ArrowUp className="w-4 h-4" />
                  Show your arrow
                </>
              )}
            </button>

            {/* Find Chair Button */}
            <button
              className="w-full mb-3 px-3 py-2 rounded-md border border-slate-600 bg-slate-700 text-gray-200 hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleFindChair}
            >
              <Armchair className="w-4 h-4" />
              Find your chair
            </button>

            {/* Find Person Section */}
            <div className="space-y-2">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full border border-slate-600 bg-slate-700 text-gray-200 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Find person by username"
                  onFocus={e => {
                    if (gameRef.current) {
                      const scene = gameRef.current.scene.getScene('OfficeMapScene');
                      detachPhaserKeyboard(scene);
                    }
                  }}
                  onBlur={e => {
                    if (gameRef.current) {
                      const scene = gameRef.current.scene.getScene('OfficeMapScene');
                      attachPhaserKeyboard(scene);
                    }
                  }}
                  value={findPersonInput}
                  onChange={e => setFindPersonInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleFindPerson()}
                />
              </div>
              <button
                className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-700 text-gray-200 hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleFindPerson}
                disabled={!findPersonInput.trim()}
              >
                <Search className="w-4 h-4" />
                Find person
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      {!isFullscreen && (
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