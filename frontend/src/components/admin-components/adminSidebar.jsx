/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ScheduleMeetingDialog from './ScheduleMeetingDialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { 
  ArrowLeft, Clock, GitBranch, Coffee, Code, Zap, DoorOpen, Activity, Users, Crown, 
  UserCircle2, OptionIcon, Calendar, CheckCircle, AlertTriangle, Target, 
  TrendingUp, MessageSquare, FileText, Settings, Award, UserCheck, 
  ClipboardList, BarChart3, Timer, Brain, Handshake 
} from "lucide-react";
import { ArrowUp, Armchair, Search, User, X } from 'lucide-react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function AdminSidebar({ socket , gameRef}) {
  
  // Admin-specific stats for HR/Product Manager
  const [adminStats, setAdminStats] = useState({
    meetingsScheduled: 12,
    tasksAssigned: 45,
    teamMembers: 25,
    activeProjects: 8,
    completedReviews: 18,
    pendingApprovals: 6,
    budgetUtilization: 78, // percentage
    teamProductivity: 92, // percentage
    clientSatisfaction: 4.7, // out of 5
    ongoingRecruitment: 3,
  });

  // Recent admin activities
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: "meeting", message: "Scheduled sprint planning meeting", time: "10 min ago", icon: Calendar },
    { id: 2, type: "task", message: "Assigned UI redesign task to FrontendWiz", time: "25 min ago", icon: ClipboardList },
    { id: 3, type: "approval", message: "Approved vacation request for CodeNinja", time: "1 hour ago", icon: CheckCircle },
    { id: 4, type: "review", message: "Completed performance review for DesignDiva", time: "2 hours ago", icon: Award },
    { id: 5, type: "project", message: "Created new project: Mobile App V2", time: "3 hours ago", icon: Target },
  ]);

  // Pending admin tasks
  const [pendingTasks, setPendingTasks] = useState([
    { id: 1, task: "Review budget proposal", priority: "high", deadline: "Today" },
    { id: 2, task: "Interview candidates", priority: "medium", deadline: "Tomorrow" },
    { id: 3, task: "Team performance analysis", priority: "low", deadline: "This week" },
    { id: 4, task: "Client presentation prep", priority: "high", deadline: "Friday" },
  ]);

  const updateAdminStats = (newStats) => {
    setAdminStats(prevStats => ({
      ...prevStats,
      ...newStats
    }));
  };

  const [onlineTeam, setOnlineTeam] = useState([
    { id: 1, name: "DevLead", status: "active", avatar: "👨‍💻", role: "Senior Developer", isHost: true },
    { id: 2, name: "CodeNinja", status: "busy", avatar: "🥷", role: "Full Stack Developer", isHost: false },
    { id: 3, name: "DesignDiva", status: "away", avatar: "👩‍🎨", role: "UI/UX Designer", isHost: false },
    { id: 4, name: "DataScientist", status: "active", avatar: "🧪", role: "Data Analyst", isHost: false },
    { id: 5, name: "FrontendWiz", status: "active", avatar: "✨", role: "Frontend Developer", isHost: false },
  ]);
  
const [showMeetingDialog, setShowMeetingDialog] = useState(false);


  React.useEffect(() => {
    const scene = gameRef?.current?.scene?.getScene?.('OfficeMapScene');
    if (showMeetingDialog) {
      // Disable Phaser keyboard input
      if (scene && scene.input && scene.input.keyboard && scene.input.keyboard.manager) {
        scene.input.keyboard.manager.enabled = false;
      }
    } else {
      // Enable Phaser keyboard input
      if (scene && scene.input && scene.input.keyboard && scene.input.keyboard.manager) {
        scene.input.keyboard.manager.enabled = true;
      }
    }
  }, [showMeetingDialog, gameRef]);
const handleScheduleMeeting = ({ title, time }) => {
  const roomId = localStorage.getItem('roomId');
  // You can get participants from your state or context if needed
  socket.emit('scheduleMeeting', {
    title,
    time,
    participants: [], // or your participant list
    roomId,
  });
};

  const handleExit = () => {
    socket.emit('leaveRoom');
    // Save admin progress or handle any cleanup
    window.location.href = '/metaverse';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
   
  return (
    <>
      <div className="flex-1 flex flex-col bg-background border-l border-border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              Admin Dashboard
            </h2>
            <Badge variant="outline" className="bg-yellow-500">
              HR/PM
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Management Overview Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Management Overview
              </CardTitle>
              <CardDescription>Key administrative metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Meetings Scheduled</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{adminStats.meetingsScheduled}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Tasks Assigned</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{adminStats.tasksAssigned}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Team Members</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{adminStats.teamMembers}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Active Projects</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{adminStats.activeProjects}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Reviews Completed</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">{adminStats.completedReviews}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Pending Approvals</span>
                  </div>
                  <Badge variant="destructive" className="font-semibold">{adminStats.pendingApprovals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Team and budget performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Team Productivity</span>
                    <span className="font-semibold text-green-600">{adminStats.teamProductivity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${adminStats.teamProductivity}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Budget Utilization</span>
                    <span className="font-semibold text-blue-600">{adminStats.budgetUtilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${adminStats.budgetUtilization}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Client Satisfaction</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-yellow-600">{adminStats.clientSatisfaction}</span>
                    <span className="text-sm text-muted-foreground">/5.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-orange-500" />
                Priority Tasks
              </CardTitle>
              <CardDescription>Critical items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.slice(0, 4).map((task, index) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{task.task}</span>
                        <span className="text-xs text-muted-foreground">Due: {task.deadline}</span>
                      </div>
                    </div>
                    <Badge variant={getPriorityColor(task.priority)} className="text-xs font-medium">
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest administrative actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.slice(0, 5).map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="border-l-2 border-blue-200 pl-4 py-2">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-blue-50">
                        <IconComponent className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-relaxed">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Team Status</span>
                </div>
                <Badge variant="outline" className="font-semibold">{onlineTeam.length} online</Badge>
              </CardTitle>
              <CardDescription>Real-time team availability and roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {onlineTeam.map((member, index) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="text-xl">{member.avatar}</span>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{member.name}</span>
                          {member.isHost && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={member.status === 'active' ? 'default' : 'secondary'} 
                      className="text-xs capitalize"
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Administrative Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Administrative Actions
              </CardTitle>
              <CardDescription>Quick access to management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" 
                onClick={() => setShowMeetingDialog(true)}
                className="justify-start h-10 border-blue-200 hover:bg-blue-500">
                  <Calendar className="h-4 w-4 mr-3 text-blue-600" />
                  <span className="font-medium">Schedule Meeting</span>
                </Button>
                <Button variant="outline" className="justify-start h-10 border-green-200 hover:bg-green-500">
                  <ClipboardList className="h-4 w-4 mr-3 text-green-600" />
                  <span className="font-medium">Assign Task</span>
                </Button>
                <Button variant="outline" className="justify-start h-10 border-purple-200 hover:bg-purple-500">
                  <MessageSquare className="h-4 w-4 mr-3 text-purple-600" />
                  <span className="font-medium">Team Broadcast</span>
                </Button>
                <Button variant="outline" className="justify-start h-10 border-orange-200 hover:bg-orange-500">
                  <FileText className="h-4 w-4 mr-3 text-orange-600" />
                  <span className="font-medium">Generate Report</span>
                </Button>
                <Button variant="outline" className="justify-start h-10 border-indigo-200 hover:bg-indigo-500">
                  <Settings className="h-4 w-4 mr-3 text-indigo-600" />
                  <span className="font-medium">Admin Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <ScheduleMeetingDialog
  open={showMeetingDialog}
  onClose={() => setShowMeetingDialog(false)}
  onSchedule={handleScheduleMeeting}
/>

        <div className="p-4 border-t mt-auto">
          <Button className="w-full" variant="destructive" onClick={handleExit}>
            <DoorOpen className="h-4 w-4 mr-2" />
            Exit Admin Panel
          </Button>
        </div>
      </div>
    </>
  );
}