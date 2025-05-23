"use client"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { PageBackground } from "../../components/page-background"


export default function ProfilePage() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [privacyEnabled, setPrivacyEnabled] = useState(false)
  const [user, setUser] = useState({ username: "Guest" }) // Default user state
    const handleSaveSettings = () => {
    // In a real app, you would save the settings here
    window.location.href = "/metaverse" // Replace with actual navigation
  }
  useEffect(() =>
    setUser(JSON.parse(localStorage.getItem('user')) || { username: "Guest" })
  , []); // Load user from localStorage on mount
    
    return(
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl pb-20">
            <div className="flex items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
            </div>

            <div className="grid gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Customize your avatar and profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                     {<img src={JSON.parse(localStorage.getItem('avatar'))?.image || '/avatars/bob.jpg'} alt="Avatar" className="rounded-full w-full h-full object-cover" />}
                    </div>
                    <Button variant="outline">{JSON.parse(localStorage.getItem('avatar'))?.name || "bob" }</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username : {user.username} </Label>
                    <h2 className=" "></h2>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Sound & Music</CardTitle>
                  <CardDescription>Configure audio settings for your metaverse experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound">Sound Effects</Label>
                    <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="music">Background Music</Label>
                    <Switch id="music" checked={musicEnabled} onCheckedChange={setMusicEnabled} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Privacy</CardTitle>
                  <CardDescription>Manage your privacy settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="privacy">Private Profile</Label>
                    <Switch id="privacy" checked={privacyEnabled} onCheckedChange={setPrivacyEnabled} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings}>Save & Enter Metaverse</Button>
              </div>
            </div>
          </div>
        </main>
    )
}