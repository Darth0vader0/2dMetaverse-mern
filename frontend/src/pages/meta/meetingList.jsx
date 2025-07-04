import React, { useState, useEffect } from 'react';

const MeetingList = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timers, setTimers] = useState({});
  const [hoveredMeeting, setHoveredMeeting] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate meeting times relative to current time
  const generateMeetingTime = (offsetMinutes) => {
    const meetingTime = new Date();
    meetingTime.setMinutes(meetingTime.getMinutes() + offsetMinutes);
    return meetingTime.toTimeString().slice(0, 5);
  };

  const meetingsData = [
    {
      id: 1,
      title: "Daily Standup Meeting for Product Development Team",
      time: generateMeetingTime(-10),
      duration: 30,
      description: "Quick sync-up to discuss progress, blockers, and plan for the day"
    },
    {
      id: 2,
      title: "Project Review",
      time: generateMeetingTime(3),
      duration: 60,
      description: "Review current project status and milestones"
    },
    {
      id: 3,
      title: "Client Presentation for Q4 Business Strategy",
      time: generateMeetingTime(15),
      duration: 90,
      description: "Present quarterly business strategy to key stakeholders"
    },
    {
      id: 4,
      title: "Team Planning Session",
      time: generateMeetingTime(-2),
      duration: 45,
      description: "Plan upcoming sprints and resource allocation"
    },
    {
      id: 5,
      title: "Code Review Session for Authentication Module",
      time: generateMeetingTime(45),
      duration: 30,
      description: "Review and discuss authentication module implementation"
    }
  ];

  // Update current time and timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const newTimers = {};
      meetingsData.forEach(meeting => {
        const meetingTime = parseTime(meeting.time);
        const meetingEndTime = new Date(meetingTime.getTime() + meeting.duration * 60000);
        const timeDiff = meetingTime - now;
        const timeToMeeting = Math.floor(timeDiff / 1000);
        
        const isActive = now >= meetingTime && now <= meetingEndTime;
        
        if (isActive) {
          const timeLeft = Math.floor((meetingEndTime - now) / 1000);
          newTimers[meeting.id] = Math.max(0, timeLeft);
        } else if (timeToMeeting > 0) {
          newTimers[meeting.id] = timeToMeeting;
        } else {
          newTimers[meeting.id] = 0;
        }
      });
      
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const joinMeeting = (meetingId, title) => {
  //logic to join meeting
  };

  const truncateText = (text, maxLength = 35) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getMeetingStatus = (meeting) => {
    const meetingTime = parseTime(meeting.time);
    const meetingEndTime = new Date(meetingTime.getTime() + meeting.duration * 60000);
    const timeDiff = meetingTime - currentTime;
    const timeToMeeting = Math.floor(timeDiff / 1000);
    
    const isActive = currentTime >= meetingTime && currentTime <= meetingEndTime;
    const fiveMinutesBefore = meetingTime.getTime() - 5 * 60 * 1000;
    const canJoin = currentTime.getTime() >= fiveMinutesBefore && currentTime <= meetingEndTime;
    
    const timerSeconds = timers[meeting.id] || 0;
    let timerText = '';
    let timerColor = '';
    
    if (isActive) {
      timerText = formatTimer(timerSeconds);
      timerColor = 'text-green-400';
    } else if (timeToMeeting > 0) {
      timerText = formatTimer(timerSeconds);
      timerColor = 'text-orange-400';
    } else {
      timerText = 'Ended';
      timerColor = 'text-gray-400';
    }

    return {
      isActive,
      canJoin,
      timerText,
      timerColor,
      timeToMeeting,
      timerSeconds
    };
  };

  const sortedMeetings = meetingsData.sort((a, b) => {
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
    return timeA - timeB;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6" onMouseMove={handleMouseMove}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Meeting Schedule</h1>
          <p className="text-gray-300">
            Current Time: {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </p>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {sortedMeetings.map((meeting) => {
            const status = getMeetingStatus(meeting);
            
            return (
              <div
                key={meeting.id}
                className={`bg-gray-800 rounded-lg border transition-all duration-300 p-6 ${
                  status.isActive 
                    ? 'border-green-500 bg-gray-800/80' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onMouseEnter={() => setHoveredMeeting(meeting)}
                onMouseLeave={() => setHoveredMeeting(null)}
              >
                <div className="flex items-center justify-between">
                  {/* Meeting Title */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-white mb-1 cursor-pointer">
                      {truncateText(meeting.title)}
                    </h2>
                  </div>

                  {/* Meeting Time */}
                  <div className="flex-shrink-0 mx-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {meeting.time}
                      </p>
                      <p className="text-sm text-gray-400">
                        {status.isActive ? 'Live Now' : 'Scheduled'}
                      </p>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="flex-shrink-0 mx-6">
                    <div className="text-center bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <p className={`text-3xl font-mono font-bold ${status.timerColor} mb-1`}>
                        {status.timerText}
                      </p>
                      <p className="text-sm text-gray-400">
                        {status.isActive ? 'Time Left' : status.timeToMeeting > 0 ? 'Time to Join' : 'Meeting Ended'}
                      </p>
                      <div className="mt-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          status.isActive ? 'bg-green-900 text-green-300' : 
                          status.timeToMeeting > 0 ? 'bg-orange-900 text-orange-300' : 
                          'bg-gray-700 text-gray-400'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            status.isActive ? 'bg-green-400 animate-pulse' : 
                            status.timeToMeeting > 0 ? 'bg-orange-400' : 
                            'bg-gray-500'
                          }`}></div>
                          {status.isActive ? 'Live' : status.timeToMeeting > 0 ? 'Pending' : 'Ended'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Join Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => status.canJoin && joinMeeting(meeting.id, meeting.title)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        status.canJoin
                          ? status.isActive
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {status.isActive ? 'Join Now' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredMeeting && (
          <div
            className="fixed z-50 bg-gray-900 border border-gray-600 rounded-lg p-4 shadow-xl max-w-sm"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              {hoveredMeeting.title}
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {hoveredMeeting.description}
            </p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">
                Time: {hoveredMeeting.time}
              </span>
              <span className="text-gray-400">
                Duration: {hoveredMeeting.duration}min
              </span>
            </div>
            <div className="mt-2">
              <span className={`text-sm ${getMeetingStatus(hoveredMeeting).timerColor}`}>
                Timer: {getMeetingStatus(hoveredMeeting).timerText}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Join buttons are enabled 5 minutes before meeting start time</p>
        </div>
      </div>
    </div>
  );
};

export default MeetingList;