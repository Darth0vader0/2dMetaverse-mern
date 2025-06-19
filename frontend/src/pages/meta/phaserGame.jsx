/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import OfficeMapScene from '../../hooks/officeMap';
import { Button } from "../../components/ui/button";
import { Zap, OptionIcon } from "lucide-react";
import AdminSidebar from '../../components/admin-components/adminSidebar';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import io from "socket.io-client";
const socket = io(backendUrl);
import SidebarStates from '../../components/sidebarStates';
import ExitModel from '../../components/exitModel';
import ArrowOptions from '../../components/arrowOptions';
export default function PhaserGame({ roomId }) {
  const gameRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChairDialog, setShowChairDialog] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const [showArrowOptions, setShowArrowOptions] = useState(false);
  const [findPersonInput, setFindPersonInput] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitPopupDismissed, setExitPopupDismissed] = useState(false);
  const isObserver = localStorage.getItem('role') === 'admin';
  // Make these available globally for Phaser to call
  window.setShowExitModal = setShowExitModal;
  window.setExitPopupDismissed = setExitPopupDismissed;

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
      gameRef.current.scene.start('OfficeMapScene', {
        socket,
        assignedChairId: isObserver ? null : assignedChairId, // Pass assigned chair ID only if not observer
        showArrow,
        observerMode: isObserver,
      });

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
          <Button
            variant={showArrow ? "default" : "outline"}
            size="icon"
            className="absolute top-28 right-4   bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
            onClick={() => { window.setShowExitModal(true); }}

          >
            <OptionIcon></OptionIcon>
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
          <ExitModel setShowExitModal={setShowExitModal} setExitPopupDismissed={setExitPopupDismissed} />
        )}
        {showArrowOptions && (
          <ArrowOptions
            setShowArrowOptions={setShowArrowOptions}
            handleFindChair={handleFindChair}
            handleFindPerson={handleFindPerson}
            gameRef={gameRef}
            showArrow={showArrow}
            handleToggleArrow={handleToggleArrow}
            detachPhaserKeyboard={detachPhaserKeyboard}
            attachPhaserKeyboard={attachPhaserKeyboard}
            findPersonInput={findPersonInput}
            setFindPersonInput={setFindPersonInput}
          />
        )}
      </div>

      {/* Sidebar */}
      {!isFullscreen && (
        localStorage.getItem('role') === 'user'
          ? <SidebarStates socket={socket} gameRef={gameRef} />
          : <AdminSidebar socket={socket} />
      )}
    </div>
  );
}