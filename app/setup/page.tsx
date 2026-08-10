"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Sprout } from "lucide-react"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const initializeDatabase = async () => {
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/setup/init-db", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Database initialized successfully! You can now sign up.")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to initialize database")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <Sprout className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Database Setup</h1>
          <p className="text-gray-600">Initialize your database tables to get started</p>
        </div>

        <div className="space-y-4">
          {status === "idle" && (
            <Button
              onClick={initializeDatabase}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              size="lg"
            >
              Initialize Database
            </Button>
          )}

          {status === "loading" && (
            <div className="flex items-center justify-center gap-2 text-emerald-600 py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Setting up your database...</span>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{message}</span>
              </div>
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                size="lg"
              >
                Go to Sign Up
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{message}</span>
              </div>
              <Button onClick={initializeDatabase} variant="outline" className="w-full bg-transparent">
                Try Again
              </Button>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>This only needs to be done once</p>
        </div>
      </Card>
    </div>
  )
}
