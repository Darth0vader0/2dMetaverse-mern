"use client"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { PageBackground } from "../../components/page-background"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: "include",
    })
    if (!result.ok) {
      const error = await result.json()
      setErrorMessage(error.message)
      return
    }
    const data = await result.json()
    localStorage.setItem('user', JSON.stringify(data.user))
    navigate("/settings")
  }

  return (
    <PageBackground className="items-center justify-center relative overflow-hidden">
      {/* Background GIF */}
      <img
        src="/gifs/metaverse-bg.gif"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        draggable={false}
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      {/* Login Form */}
      <div className="w-full max-w-md p-4 relative z-20">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your metaverse</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-primary underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageBackground>
  )
}