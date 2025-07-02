import React, { useState, useEffect } from "react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Settings, 
  Monitor,
  Volume2,
  Users
} from "lucide-react";

export default function MeetingRoom({ roomId, participants = [], userId, onLeave }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Mock participants for demo - replace with your actual participants
  const mockParticipants = [
    { userId: "user1", username: "Alex Chen", isVideoOn: true, isMuted: false, avatar: "AC" },
    { userId: "user2", username: "Sarah Miller", isVideoOn: false, isMuted: true, avatar: "SM" },
    { userId: "user3", username: "Mike Johnson", isVideoOn: true, isMuted: false, avatar: "MJ" },
    { userId: "user4", username: "Emma Davis", isVideoOn: true, isMuted: false, avatar: "ED" },
    { userId: "user5", username: "Ryan Wilson", isVideoOn: false, isMuted: false, avatar: "RW" },
  ];

  const allParticipants = participants.length > 0 ? participants : mockParticipants;

  // Calculate grid layout based on participant count
  const getGridLayout = (count) => {
    if (count <= 1) return "grid-cols-1";
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  const getGridRows = (count) => {
    if (count <= 2) return "grid-rows-1";
    if (count <= 4) return "grid-rows-2";
    if (count <= 6) return "grid-rows-2";
    if (count <= 9) return "grid-rows-3";
    return "grid-rows-3";
  };

  const ParticipantVideo = ({ participant, isSelected, onClick }) => {
    const isCurrentUser = participant.userId === userId;
    
    return (
      <div
        className={`
          relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'ring-2 ring-blue-500 scale-105' 
            : 'hover:ring-2 hover:ring-gray-600'
          }
          ${participant.isVideoOn 
            ? 'bg-gray-800' 
            : 'bg-gradient-to-br from-purple-900 to-blue-900'
          }
        `}
        onClick={() => onClick(participant)}
      >
        {participant.isVideoOn ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-gray-400 text-sm">📹 Video Feed</div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
              {participant.avatar}
            </div>
          </div>
        )}
        
        {/* Participant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium truncate">
              {participant.username}
              {isCurrentUser && " (You)"}
            </span>
            <div className="flex items-center space-x-1">
              {participant.isMuted && (
                <MicOff className="w-4 h-4 text-red-400" />
              )}
              {!participant.isVideoOn && (
                <VideoOff className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Speaking Indicator */}
        {!participant.isMuted && (
          <div className="absolute top-2 left-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-white font-semibold">Meeting Room</h2>
            <span className="text-gray-400 text-sm">({allParticipants.length} participants)</span>
          </div>
          <div className="text-gray-400 text-sm">
            Room ID: {roomId}
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-4">
        {selectedParticipant ? (
          /* Selected Participant Full View */
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            {/* Main Featured Participant */}
            <div className="flex-1 mb-4 relative">
              <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {selectedParticipant.isVideoOn ? (
                  /* Video Feed Full Screen */
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                    <div className="text-6xl">📹</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 text-white/80 text-sm">
                      Video Feed - {selectedParticipant.username}
                    </div>
                  </div>
                ) : (
                  /* Large Avatar Display */
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                    
                    {/* Large Avatar */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-6xl shadow-2xl mb-6 animate-in zoom-in duration-500">
                        {selectedParticipant.avatar}
                      </div>
                      <h2 className="text-white text-3xl font-semibold mb-2">
                        {selectedParticipant.username}
                      </h2>
                      <div className="flex items-center space-x-4 text-gray-300">
                        {selectedParticipant.isMuted ? (
                          <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                            <MicOff className="w-5 h-5 text-red-400" />
                            <span className="text-sm">Muted</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                            <Mic className="w-5 h-5 text-green-400" />
                            <span className="text-sm">Speaking</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Click to minimize indicator */}
                <div className="absolute top-4 right-4 bg-black/50 rounded-lg px-3 py-1 text-white/70 text-sm cursor-pointer hover:bg-black/70 transition-all"
                     onClick={() => setSelectedParticipant(null)}>
                  ← Back to Grid
                </div>
              </div>
            </div>
            
            {/* Other Participants Strip */}
            <div className="h-28 bg-gray-800/50 rounded-lg p-3">
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                {allParticipants
                  .filter(p => p.userId !== selectedParticipant.userId)
                  .map((participant) => (
                    <div key={participant.userId} className="flex-shrink-0 w-20 h-20 group">
                      <div
                        className="w-full h-full rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
                        onClick={() => setSelectedParticipant(participant)}
                      >
                        {participant.isVideoOn ? (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                            📹
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {participant.avatar}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-center text-xs text-gray-400 mt-1 truncate">
                        {participant.username}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className={`
            h-full grid gap-4 animate-in fade-in duration-300
            ${getGridLayout(allParticipants.length)} 
            ${getGridRows(allParticipants.length)}
          `}>
            {allParticipants.map((participant) => (
              <ParticipantVideo
                key={participant.userId}
                participant={participant}
                isSelected={false}
                onClick={setSelectedParticipant}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Microphone */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`
              p-3 rounded-full transition-all duration-200
              ${isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
              }
            `}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Video */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`
              p-3 rounded-full transition-all duration-200
              ${isVideoOff 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
              }
            `}
          >
            {isVideoOff ? (
              <VideoOff className="w-5 h-5 text-white" />
            ) : (
              <Video className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`
              p-3 rounded-full transition-all duration-200
              ${isScreenSharing 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-700 hover:bg-gray-600'
              }
            `}
          >
            <Monitor className="w-5 h-5 text-white" />
          </button>

          {/* Volume */}
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200">
            <Volume2 className="w-5 h-5 text-white" />
          </button>

          {/* Settings */}
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-200">
            <Settings className="w-5 h-5 text-white" />
          </button>

          {/* Leave Call */}
          <button
            onClick={onLeave}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 ml-8"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Exit Full View Button */}
        {selectedParticipant && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setSelectedParticipant(null)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all duration-200"
            >
              Back to Grid View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}