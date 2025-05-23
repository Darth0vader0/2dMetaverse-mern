import React, { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { PageBackground } from "../../components/page-background"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [gender,setGender] = useState('male')
  const [error, setError] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    // In a real app, you would register the user here
    const result = await fetch(`${backendUrl}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        nickname,
        password,
        gender
      }),

    })
    if (!result.ok) {
      const error = await result.json()
      setError(error.message)
      return;
    }
    // If the signup is successful, redirect to the settings page

    window.location.href = "/settings" // Replace Next.js router with plain navigation
  }

  return (
   
  <PageBackground className="items-center  justify-center relative overflow-hidden">
    {/* Background GIF */}
    <img
      src="/gifs/signup-bg.gif"
      alt="background"
      className="absolute inset-0 w-full h-full object-cover z-0"
      draggable={false}
    />
    {/* Overlay for readability */}
    <div className="absolute inset-0 bg-black/70 z-10" />
    {/* Signup Form */}
    <div className="w-full max-w-md p-4 relative z-20">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create an account to start your metaverse journey</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">username</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">nickname</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    className="accent-purple-600"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className="accent-pink-500"
                  />
                  <span>Female</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={gender === "other"}
                    onChange={() => setGender("other")}
                    className="accent-blue-400"
                  />
                  <span>Other</span>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-primary underline">
                Login
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  </PageBackground>
)
  
}