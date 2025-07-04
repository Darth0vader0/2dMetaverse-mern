/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import OfficeMapScene from '../../hooks/officeMap';
import { Button } from "../../components/ui/button";
import { Zap, OptionIcon, BellIcon, X, Calendar, Clock, Users, CheckCircle } from "lucide-react";
import AdminSidebar from '../../components/admin-components/adminSidebar';
import SidebarStates from '../../components/sidebarStates';
import ExitModel from '../../components/exitModel';
import ArrowOptions from '../../components/arrowOptions';
import MeetingRoom from './meetingRoom';
import io from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
  const isObserver = localStorage.getItem('role') === 'admin';
  const [meetingNotification, setMeetingNotification] = useState(null);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [hasMeetingNotification, setHasMeetingNotification] = useState(false);

  // Timer for admin meeting countdown
  const [meetingTimer, setMeetingTimer] = useState(null); // { timeLeft: seconds, meetingData }
  const [timerInterval, setTimerInterval] = useState(null);

  // Meeting room state
  const [inMeeting, setInMeeting] = useState(false);
  const [meetingRoomId, setMeetingRoomId] = useState(null);

  // Join meeting handler
  const handleJoinMeeting = (meetingData) => {
    setMeetingRoomId(meetingData.roomId);
    setInMeeting(true);
    // Optionally: Remove character from map here
  };

  // Leave meeting handler
  const handleLeaveMeeting = () => {
    setInMeeting(false);
    setMeetingRoomId(null);
    // Optionally: Add character back to map here
  };

  // Expose exit modal controls globally (if needed elsewhere)
  window.setShowExitModal = setShowExitModal;
  window.setExitPopupDismissed = setExitPopupDismissed;

  // Chair assignment dialog logic
  useEffect(() => {
    let assignedChairs = {};
    try {
      assignedChairs = JSON.parse(localStorage.getItem('assignedChairIds')) || {};
    } catch (e) {
      assignedChairs = {};
    }
    if (!assignedChairs[roomId]) {
      setShowChairDialog(true);
    } else {
      setShowChairDialog(false);
    }
  }, [roomId]);

  // Store roomId in localStorage and listen for player events (optional)
  useEffect(() => {
    localStorage.setItem('roomId', roomId);
    // socket.on('currentPlayersForFrontend', ...)
    // socket.on('newPlayerInFrontend', ...)
  }, [roomId]);

  // Listen for meeting scheduled event
  useEffect(() => {
    socket.on('meetingScheduled', (meetingData) => {
      const meetingDateTimeString = `${meetingData.date} ${meetingData.time}`;
      const meetingStart = new Date(meetingDateTimeString).getTime();
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((meetingStart - now) / 1000));
      setMeetingTimer({ timeLeft, meetingData });
      console.log('meetingData.date:', meetingData.date);
      console.log('meetingData.time:', meetingData.time);
      console.log('meetingDateTimeString:', meetingDateTimeString);
      setMeetingNotification(meetingData);
      setHasMeetingNotification(true);
      // For admin: start timer instead of showing dialog
      if (isObserver) {
        console.log('Meeting scheduled:', meetingData);
        // Calculate seconds until meeting time.
        // Combining date and time is crucial for a valid Date object.
        const meetingDateTimeString = `${meetingData.date} ${meetingData.time}`;
        const meetingStart = new Date(meetingDateTimeString).getTime();
        const now = Date.now();
        const timeLeft = Math.max(0, Math.floor((meetingStart - now) / 1000));
        setMeetingTimer({ timeLeft, meetingData });
      }
    });
    return () => {
      socket.off('meetingScheduled');
    };
  }, [isObserver]);

  // Meeting timer countdown for admin
  useEffect(() => {
    if (meetingTimer && meetingTimer.timeLeft > 0) {
      const interval = setInterval(() => {
        setMeetingTimer(prev => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
            clearInterval(interval);
            // Auto-join meeting
            handleJoinMeeting(prev.meetingData);
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [meetingTimer]);

  // Phaser game setup
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
          arcade: { debug: false },
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
        assignedChairId: isObserver ? null : assignedChairId,
        showArrow,
        observerMode: isObserver,
      });

      // Responsive resize
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

  // Update showArrow in Phaser scene
  useEffect(() => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('OfficeMapScene');
      if (scene && scene.data) {
        scene.data.set('showArrow', showArrow);
      }
    }
  }, [showArrow]);

  // Utility: detach/attach Phaser keyboard (for dialogs)
  function detachPhaserKeyboard(scene) {
    if (scene && scene.input && scene.input.keyboard && scene.input.keyboard.manager) {
      scene.input.keyboard.manager.enabled = false;
    }
  }
  function attachPhaserKeyboard(scene) {
    if (scene && scene.input && scene.input.keyboard && scene.input.keyboard.manager) {
      scene.input.keyboard.manager.enabled = true;
    }
  }

  // UI handlers
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      const container = document.getElementById('phaser-container');
      if (gameRef.current) {
        gameRef.current.scale.resize(container.clientWidth, container.clientHeight);
      }
    }, 100);
  };

  const handleToggleArrow = () => {
    setShowArrow(prev => !prev);
    setShowArrowOptions(false);
  };

  const handleFindChair = () => {
    setShowArrowOptions(false);
  };

  const handleFindPerson = () => {
    if (findPersonInput.trim()) {
      setShowArrowOptions(false);
      setFindPersonInput("");
    }
  };

  const handleChairSelection = async () => {
    // ...your chair selection logic...
    setShowChairDialog(false);
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen w-screen bg-black">
      {/* Game Container */}
      <div
        id="phaser-container"
        className={`relative ${isFullscreen ? 'w-full' : 'flex-3'} h-full overflow-hidden border-8 border-primary/40 rounded-xl`}
        style={{ flex: isFullscreen ? '1' : '3' }}
      >
        <div>
          {/* Fullscreen and utility buttons (not for admin or in meeting) */}
          {
            localStorage.getItem('role') !== 'admin' && !inMeeting && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
                  onClick={toggleFullscreen}
                >
                  <Zap className="h-4 w-4" />
                </Button>
                <Button
                  variant={showArrow ? "default" : "outline"}
                  size="icon"
                  className="absolute right-4 top-16 bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
                  onClick={() => { setShowArrowOptions(true); }}
                  title={showArrow ? "Hide Arrow" : "Show Arrow"}
                >
                  <img src="/arrows/arrow.png" alt="Arrow" className="h-5 w-5" />
                </Button>
                <Button
                  variant={showArrow ? "default" : "outline"}
                  size="icon"
                  className="absolute right-4 top-40 bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
                  onClick={() => {
                    if (meetingNotification) setShowMeetingDialog(true);
                    setHasMeetingNotification(false);
                  }}
                  title="Show Meeting Notification"
                >
                  <div className="relative">
                    <BellIcon className="h-5 w-5" />
                    {hasMeetingNotification && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </div>
                </Button>
                <Button
                  variant={showArrow ? "default" : "outline"}
                  size="icon"
                  className="absolute top-28 right-4 bg-background/80 backdrop-blur-sm z-10 hover:bg-background"
                  onClick={() => { window.setShowExitModal(true); }}
                >
                  <OptionIcon />
                </Button>
              </>
            )
          }

          {/* Meeting Dialog for users */}
          {!isObserver && showMeetingDialog && meetingNotification && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 p-0 w-96 max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 relative">
                  <button
                    onClick={() => setShowMeetingDialog(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Meeting Scheduled</h3>
                      <p className="text-white/80 text-sm">You have been invited</p>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="text-center mb-4">
                    <h4 className="text-white font-semibold text-xl mb-1">{meetingNotification.title}</h4>
                    <p className="text-slate-400 text-sm">{meetingNotification.location}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-3">
                      <div className="bg-blue-600/20 rounded-full p-2">
                        <Clock className="text-blue-400" size={16} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{meetingNotification.time}</p>
                        <p className="text-slate-400 text-xs">{meetingNotification.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 bg-slate-700/30 rounded-lg p-3">
                      <div className="bg-purple-600/20 rounded-full p-2 mt-0.5">
                        <Users className="text-purple-400" size={16} />
                      </div>
                    
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowMeetingDialog(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        handleJoinMeeting(meetingNotification);
                        setShowMeetingDialog(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle size={18} />
                      <span>Join Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin: Meeting Timer */}
          {isObserver && meetingTimer && (
            <div className="fixed top-8 left-8 z-50 flex flex-col items-center">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-full shadow-2xl border-4 border-blue-400 w-40 h-40 flex flex-col items-center justify-center relative animate-fade-in">
                {/* Stopwatch Icon */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#38bdf8" strokeWidth="2" fill="#1e293b" />
                    <rect x="11" y="4" width="2" height="4" rx="1" fill="#38bdf8" />
                    <rect x="16.24" y="7.76" width="2" height="4" rx="1" transform="rotate(45 16.24 7.76)" fill="#38bdf8" />
                  </svg>
                </div>
                {/* Timer */}
                <div className="text-4xl font-mono font-bold text-white mb-2 mt-6">
                  {Math.floor(meetingTimer.timeLeft / 60).toString().padStart(2, '0')}
                  :
                  {(meetingTimer.timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-white text-center font-semibold px-2">
                  {meetingTimer.meetingData.title}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Meeting Room */}
        {inMeeting && (
          <MeetingRoom
            roomId={meetingRoomId}
            socket={socket}
            userId={localStorage.getItem("userId")}
            onLeave={handleLeaveMeeting}
          />
        )}

        {/* Chair Chooser Dialog */}
        {!isObserver && showChairDialog && (
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

        {/* Exit Modal */}
        {showExitModal && (
          <ExitModel setShowExitModal={setShowExitModal} setExitPopupDismissed={setExitPopupDismissed} />
        )}

        {/* Arrow Options */}
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
          : <AdminSidebar socket={socket} gameRef={gameRef} />
      )}
    </div>
  );
}