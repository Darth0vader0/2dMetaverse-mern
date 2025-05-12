import React, { useEffect, useRef, useState } from "react"
import { Button } from "../../components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PageBackground } from "../../components/page-background"

export default function MetaversePage() {
  const [isGuest, setIsGuest] = useState(false)
  const gameContainerRef = useRef(null)
  const [gameLoaded, setGameLoaded] = useState(false)

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
          <div
            ref={gameContainerRef}
            className="w-full h-[calc(100vh-65px)] bg-black/10"
            style={{
              backgroundImage: "url('/placeholder.svg?height=800&width=1200')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute bottom-4 left-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg max-w-md">
              <p className="text-sm">
                This is a placeholder for the Phaser game engine. In a real application, this would be where the 2D
                metaverse is rendered.
              </p>
            </div>
          </div>
        )}
      </main>
    </PageBackground>
  )
}