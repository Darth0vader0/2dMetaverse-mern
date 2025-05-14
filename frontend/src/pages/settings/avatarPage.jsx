"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function AvatarCustomizationPage() {
  const [gender, setGender] = useState("male") // "male" or "female"
  const [currentAvatar, setCurrentAvatar] = useState(0)
  
  // Sample avatar data - replace with your actual avatars
  const maleAvatars = [
    { id: 1, name: "Default Guy", image: "👨", color: "bg-blue-600" },
    { id: 2, name: "Business Man", image: "👨‍💼", color: "bg-gray-600" },
    { id: 3, name: "Cool Dude", image: "😎", color: "bg-green-600" },
    { id: 4, name: "Bearded Fellow", image: "🧔", color: "bg-orange-600" }
  ]
  
  const femaleAvatars = [
    { id: 1, name: "Default Girl", image: "👩", color: "bg-purple-600" },
    { id: 2, name: "Business Woman", image: "👩‍💼", color: "bg-pink-600" },
    { id: 3, name: "Cool Lady", image: "👱‍♀️", color: "bg-red-600" },
    { id: 4, name: "Tech Girl", image: "👩‍💻", color: "bg-indigo-600" }
  ]
  
  const avatars = gender === "male" ? maleAvatars : femaleAvatars
  
  const handlePrevious = () => {
    setCurrentAvatar((prev) => (prev === 0 ? avatars.length - 1 : prev - 1))
  }
  
  const handleNext = () => {
    setCurrentAvatar((prev) => (prev === avatars.length - 1 ? 0 : prev + 1))
  }
  
  const handleGenderChange = (newGender) => {
    setGender(newGender)
    setCurrentAvatar(0) // Reset to first avatar when changing gender
  }
  
  const handleSaveAvatar = () => {
    // In a real app, you would save the selected avatar here
    window.location.href = "/settings" // Navigate back to settings
  }
  
  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="mx-auto max-w-4xl pb-20">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Avatar Customization</h1>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Choose Your Character</CardTitle>
              <CardDescription>Select gender and customize your avatar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gender selection */}
              <div className="flex gap-4 justify-center">
                <Button 
                  variant={gender === "male" ? "default" : "outline"} 
                  onClick={() => handleGenderChange("male")}
                  className="w-32"
                >
                  Male
                </Button>
                <Button 
                  variant={gender === "female" ? "default" : "outline"} 
                  onClick={() => handleGenderChange("female")}
                  className="w-32"
                >
                  Female
                </Button>
              </div>
              
              {/* Avatar carousel */}
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-2">{avatars[currentAvatar].name}</h2>
                
                <div className="flex items-center justify-center gap-6 w-full my-6">
                  {/* Previous button */}
                  <Button variant="outline" size="icon" onClick={handlePrevious} className="rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  {/* Avatar display */}
                  <div className={`h-32 w-32 md:h-44 md:w-44 rounded-full flex items-center justify-center ${avatars[currentAvatar].color} text-white`}>
                    <span className="text-5xl md:text-7xl">{avatars[currentAvatar].image}</span>
                  </div>
                  
                  {/* Next button */}
                  <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                
                {/* Avatar selection indicators */}
                <div className="flex gap-2 mt-2">
                  {avatars.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentAvatar ? "bg-primary" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Additional customization options could go here */}
              <div className="pt-4">
                <h3 className="text-md font-medium mb-2">Selected Avatar: {avatars[currentAvatar].name}</h3>
                <p className="text-muted-foreground text-sm">
                  This avatar will represent you in the 2D Metaverse
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => window.location.href = "/settings"}>
              Cancel
            </Button>
            <Button onClick={handleSaveAvatar}>Save Avatar</Button>
          </div>
        </div>
      </div>
    </main>
  )
}