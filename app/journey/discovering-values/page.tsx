"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Users, Briefcase, Home, Sparkles, Book } from "lucide-react"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function DiscoveringValuesPage() {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [topValue, setTopValue] = useState("")
  const [valueConnection, setValueConnection] = useState("")
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const valueCategories = [
    {
      category: "Relationships",
      icon: Heart,
      color: "text-pink-600",
      values: ["Family", "Friendship", "Love", "Connection", "Trust", "Loyalty"],
    },
    {
      category: "Personal Growth",
      icon: Sparkles,
      color: "text-purple-600",
      values: ["Learning", "Creativity", "Independence", "Self-awareness", "Courage", "Authenticity"],
    },
    {
      category: "Community",
      icon: Users,
      color: "text-blue-600",
      values: ["Helping others", "Justice", "Compassion", "Respect", "Belonging", "Contribution"],
    },
    {
      category: "Work & Achievement",
      icon: Briefcase,
      color: "text-green-600",
      values: ["Success", "Excellence", "Achievement", "Responsibility", "Hard work", "Innovation"],
    },
    {
      category: "Health & Wellbeing",
      icon: Home,
      color: "text-orange-600",
      values: ["Physical health", "Mental health", "Balance", "Peace", "Safety", "Comfort"],
    },
    {
      category: "Spirituality & Meaning",
      icon: Book,
      color: "text-indigo-600",
      values: ["Purpose", "Faith", "Wisdom", "Gratitude", "Nature", "Tradition"],
    },
  ]

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}

    if (selectedValues.length === 0) newErrors.values = true
    if (!topValue.trim()) newErrors.topValue = true
    if (!valueConnection.trim()) newErrors.connection = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert(
        "Please complete all exercises: select at least one value, identify your top value, and write about the connection to your recovery.",
      )
      return
    }

    setIsCompleting(true)

    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug: "discovering-values",
          moduleTitle: "Discovering Your Values",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to complete module: ${errorData.error || "Unknown error"}`)
        return
      }

      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error completing module:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <Link href="/journey">
          <Button variant="ghost" size="sm" className="mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Discovering Your Values</h1>
              <p className="text-xs sm:text-sm text-gray-600">Module 5 of 11</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Identify what truly matters and use it as a compass for meaningful living.
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-4 sm:p-6 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">What Are Values?</h2>
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            Values are what matter most to you. They're different from goals—goals can be achieved, but values guide your life direction.
          </p>
          <div className="bg-purple-50 p-3 rounded-lg text-sm">
            <p className="text-gray-700"><strong>Goal:</strong> "Get married"</p>
            <p className="text-gray-700"><strong>Value:</strong> "Love and connection"</p>
          </div>
        </Card>

        {/* Why Values Matter */}
        <Card className="p-4 sm:p-6 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Why They Matter</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Give your life meaning and direction</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Help you make difficult decisions</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Guide you during challenging times</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Living by them reduces urges and increases wellbeing</span>
            </li>
          </ul>
        </Card>

        {/* Value Selection - Compact Grid */}
        <Card className="p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">Explore Values</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-5">
            Select the values that resonate with you.
          </p>

          <div className="space-y-4">
            {valueCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${category.color} flex-shrink-0`} />
                    <span className="text-xs sm:text-sm font-medium text-gray-600">{category.category}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {category.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => {
                          toggleValue(value)
                          if (errors.values) setErrors({ ...errors, values: false })
                        }}
                        className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all font-medium ${
                          selectedValues.includes(value)
                            ? "bg-purple-600 text-white border-purple-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {errors.values && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600 font-medium">
                Please select at least one value
              </p>
            </div>
          )}

          {selectedValues.length > 0 && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Selected ({selectedValues.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((val) => (
                  <span key={val} className="inline-flex items-center gap-1 bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {val}
                    <button
                      onClick={() => setSelectedValues(selectedValues.filter((v) => v !== val))}
                      className="hover:text-purple-900 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Reflection Exercise */}
        <Card className="p-4 sm:p-6 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Reflection</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Which value feels most important right now?
              </label>
              {selectedValues.length > 0 ? (
                <select
                  value={topValue}
                  onChange={(e) => {
                    setTopValue(e.target.value)
                    if (errors.topValue) setErrors({ ...errors, topValue: false })
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.topValue ? "border-red-500 border-2" : "border-gray-300"
                  }`}
                >
                  <option value="">Select your top value...</option>
                  {selectedValues.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 text-xs border-2 border-amber-300 bg-amber-50 rounded-lg text-amber-800">
                  Select a value above first
                </div>
              )}
              {errors.topValue && <p className="text-xs text-red-600 mt-1">Required</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                How does this connect to your recovery?
              </label>
              <textarea
                value={valueConnection}
                onChange={(e) => {
                  setValueConnection(e.target.value)
                  if (errors.connection) setErrors({ ...errors, connection: false })
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px] ${
                  errors.connection ? "border-red-500 border-2" : "border-gray-300"
                }`}
                placeholder="Your connection to this value..."
              />
              {errors.connection && <p className="text-xs text-red-600 mt-1">Required</p>}
            </div>
          </div>
        </Card>

        {/* Living Your Values */}
        <Card className="p-4 sm:p-6 mb-6 bg-purple-50 border-purple-200">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Living Your Values</h2>
          <p className="text-xs sm:text-sm text-gray-700 mb-3">
            Values become powerful through action. Small steps make a big difference.
          </p>
          <ul className="space-y-1">
            <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>What's one action today that aligns with my values?</span>
            </li>
            <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Which choice is more aligned with my values?</span>
            </li>
            <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>How can I bring more values into my daily life?</span>
            </li>
          </ul>
        </Card>

        <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="w-full">
          {isCompleting ? "Completing..." : "Complete Module"}
        </Button>

        {showDialog && (
          <ModuleCompletionDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            moduleTitle="Discovering Your Values"
            keyLearning="Understanding what values are, identifying your personal values, and learning how to use them as a compass for meaningful living"
            creditsAwarded={1}
            nextModule={{
              title: "Recognizing Your Strengths",
              slug: "recognizing-strengths",
            }}
          />
        )}
      </div>
    </div>
  )
}
