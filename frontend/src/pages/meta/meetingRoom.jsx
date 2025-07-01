import React, { useEffect, useState } from "react";

export default function MeetingRoom({ roomId, socket, userId, onLeave }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Join the meeting room
    socket.emit("joinMeetingRoom", { roomId, userId });

    // Listen for participant updates
    socket.on("meetingParticipants", setParticipants);

    // Cleanup on leave
    return () => {
      socket.emit("leaveMeetingRoom", { roomId, userId });
      socket.off("meetingParticipants", setParticipants);
    };
  }, [roomId, userId, socket]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96">
        <h2 className="font-bold text-lg mb-4">Meeting Room</h2>
        <ul className="mb-4">
          {participants.map((p) => (
            <li key={p.userId} className="py-1">
              {p.username} {p.userId === userId && "(You)"}
            </li>
          ))}
        </ul>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onLeave}
        >
          Leave Meeting
        </button>
      </div>
    </div>
  );
}