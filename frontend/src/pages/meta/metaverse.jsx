"use client"

import React, { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Plus, Users, Globe, Star, X } from "lucide-react"
import { PageBackground } from "../../components/page-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

export default function MetaversePage() {
  const [isGuest, setIsGuest] = useState(false)
  const [gameLoaded, setGameLoaded] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [spaceName, setSpaceName] = useState("")
  const [spaceCapacity, setSpaceCapacity] = useState("10")
  const [joinCode, setJoinCode] = useState("")
  
  // Sample existing worlds
  const existingWorlds = [
    { id: 1, name: "Central Plaza", users: 42, image: "🏙️", color: "bg-purple-600" },
    { id: 2, name: "Fantasy Land", users: 28, image: "🏰", color: "bg-blue-600" },
    { id: 3, name: "Tech Hub", users: 15, image: "🚀", color: "bg-green-600" },
    { id: 4, name: "Cosmic Voyage", users: 31, image: "🌌", color: "bg-indigo-600" }
  ]

  useEffect(() => {
    // Simulate fetching query parameters (replace with actual logic if needed)
    const urlParams = new URLSearchParams(window.location.search)
    setIsGuest(urlParams.get("guest") === "true")

    // Simulate game loading
    const timer = setTimeout(() => {
      setGameLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleNavigation = (path) => {
    window.location.href = path
  }

    const handleJoinWorld = (worldId) => {
    // In a real app, this would connect to the world
    console.log(`Joining world ${worldId}`)
    // For demo purposes, just show a loading state
    setGameLoaded(false)
    setTimeout(() => {
      setGameLoaded(true)
    }, 1000)
  }
  const handleCreateSpace = () => {
    if (!spaceName) return
    
    // In a real app, this would create a new space on the server
    console.log(`Creating space: ${spaceName} with capacity ${spaceCapacity}`)
    setShowCreateModal(false)
    
    // For demo purposes, show loading and then succeed
    setGameLoaded(false)
    setTimeout(() => {
      setGameLoaded(true)
      // You could redirect to the new space here
    }, 1000)
  }
  
  const handleJoinByCode = () => {
    if (!joinCode) return
    
    // In a real app, this would validate and join the space
    console.log(`Joining space with code: ${joinCode}`)
    setShowJoinModal(false)
    
    // For demo purposes, show loading and then succeed
    setGameLoaded(false)
    setTimeout(() => {
      setGameLoaded(true)
      // You could redirect to the joined space here
    }, 1000)
  }

  return (
    <PageBackground className="flex-col">
      <header className="bg-background/80 backdrop-blur-sm p-4 border-b flex items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => handleNavigation(isGuest ? "/" : "/settings")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="ml-4 text-xl font-bold">2D Metaverse World</h1>
        {isGuest && (
          <div className="ml-auto">
            <Button size="sm" onClick={() => handleNavigation("/login")}>
              Login to Save Progress
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1 relative">
        {!gameLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4">Loading Metaverse...</p>
            </div>
          </div>
        ) : (
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <div className="grid gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Create or Join Space</CardTitle>
                  <CardDescription>Start your own world or join an existing one</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => setShowCreateModal(true)} className="flex-1 h-20 text-lg flex flex-col gap-2 items-center justify-center">
                      <Plus className="h-6 w-6" />
                      <span>Create New Space</span>
                    </Button>
                    <Button variant="outline" onClick={() => setShowJoinModal(true)} className="flex-1 h-20 text-lg flex flex-col gap-2 items-center justify-center">
                      <Users className="h-6 w-6" />
                      <span>Join by Code</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Featured Worlds</CardTitle>
                  <CardDescription>Explore popular metaverse spaces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {existingWorlds.map((world) => (
                      <div 
                        key={world.id} 
                        className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => window.location.href = `/game`}
                      >
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center ${world.color} text-white flex-shrink-0`}>
                          <span className="text-2xl">{world.image}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{world.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{world.users} online</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Explore More</CardTitle>
                  <CardDescription>Discover worlds by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Star className="h-4 w-4" /> Featured
                    </Button>
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Globe className="h-4 w-4" /> Public
                    </Button>
                    <Button variant="outline" size="sm">Games</Button>
                    <Button variant="outline" size="sm">Education</Button>
                    <Button variant="outline" size="sm">Art</Button>
                    <Button variant="outline" size="sm">Social</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      {/* Create Space Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Space</DialogTitle>
            <DialogDescription>
              Create your own metaverse space for others to join
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="space-name">Space Name</Label>
              <Input 
                id="space-name" 
                value={spaceName} 
                onChange={(e) => setSpaceName(e.target.value)} 
                placeholder="Enter a name for your space"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Max Capacity</Label>
              <select 
                id="capacity" 
                value={spaceCapacity} 
                onChange={(e) => setSpaceCapacity(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="5">5 people</option>
                <option value="10">10 people</option>
                <option value="25">25 people</option>
                <option value="50">50 people</option>
                
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateSpace}>Create Space</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Join by Code Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join by Code</DialogTitle>
            <DialogDescription>
              Enter a space code to join an existing metaverse
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="join-code">Space Code</Label>
              <Input 
                id="join-code" 
                value={joinCode} 
                onChange={(e) => setJoinCode(e.target.value)} 
                placeholder="Enter the space code (e.g. ABCD123)"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleJoinByCode}>Join Space</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageBackground>
  )
}