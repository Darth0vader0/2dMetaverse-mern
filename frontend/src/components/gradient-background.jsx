"use client"

export function GradientBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-purple-600 bg-[length:400%_400%]"
      style={{
        animation: "gradient 15s ease infinite",
        backgroundSize: "400% 400%",
      }}
    />
  )
}