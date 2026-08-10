"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Star, Award, CheckCircle } from "lucide-react"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function RecognizingStrengthsPage() {
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([])
  const [strengthStory, setStrengthStory] = useState("")
  const [futureUse, setFutureUse] = useState("")
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const strengthCategories = [
    {
      category: "Personal Qualities",
      strengths: [
        "Resilient",
        "Determined",
        "Patient",
        "Honest",
        "Loyal",
        "Kind",
        "Brave",
        "Adaptable",
        "Open-minded",
        "Humble",
      ],
    },
    {
      category: "Social Strengths",
      strengths: [
        "Good listener",
        "Empathetic",
        "Supportive",
        "Team player",
        "Communicator",
        "Friendly",
        "Trustworthy",
        "Generous",
        "Forgiving",
        "Understanding",
      ],
    },
    {
      category: "Practical Skills",
      strengths: [
        "Problem solver",
        "Organized",
        "Creative",
        "Hardworking",
        "Reliable",
        "Resourceful",
        "Persistent",
        "Focused",
        "Practical",
        "Skilled",
      ],
    },
    {
      category: "Emotional Strengths",
      strengths: [
        "Self-aware",
        "Hopeful",
        "Optimistic",
        "Calm",
        "Positive",
        "Grateful",
        "Mindful",
        "Reflective",
        "Accepting",
        "Peaceful",
      ],
    },
  ]

  const toggleStrength = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      setSelectedStrengths(selectedStrengths.filter((s) => s !== strength))
    } else {
      setSelectedStrengths([...selectedStrengths, strength])
    }
  }

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}

    if (selectedStrengths.length === 0) newErrors.strengths = true
    if (!strengthStory || strengthStory.trim().length === 0) newErrors.story = true
    if (!futureUse || futureUse.trim().length === 0) newErrors.future = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Please complete all exercises: select at least one strength and complete both reflection questions.")
      return
    }

    setIsCompleting(true)

    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug: "recognizing-strengths",
          moduleTitle: "Recognizing Your Strengths",
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

  const learningPoints = [
    "You've identified your personal strengths and positive qualities",
    "You understand that everyone has strengths, even during difficult times",
    "You've reflected on how you've used your strengths in the past",
    "You can draw on your strengths to support your recovery and wellbeing",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Link href="/journey">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journey
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recognizing Your Strengths</h1>
              <p className="text-gray-600">Module 6 of 11</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Identify and celebrate your personal strengths to build confidence and resilience.
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Everyone Has Strengths</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            When we're struggling, it's easy to focus on our difficulties and forget our strengths. But recognizing what
            you're good at – your positive qualities, skills, and abilities – is an important part of recovery.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Your strengths are the foundation you can build on. They've helped you get through challenges before, and
            they'll help you again.
          </p>
        </Card>

        {/* Why Strengths Matter */}
        <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Why Focus on Strengths?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Builds confidence and self-esteem</span>
            </li>
            <li className="flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Reminds you of your resilience and capability</span>
            </li>
            <li className="flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Provides resources for coping with challenges</span>
            </li>
            <li className="flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Shifts focus from problems to possibilities</span>
            </li>
          </ul>
        </Card>

        {/* Strength Selection */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Identify Your Strengths</h2>
          <p className="text-gray-700 mb-6">
            Look through these strength categories and select the ones that describe you. Be generous with yourself – if
            a strength applies even sometimes, select it.
          </p>

          <div className="space-y-6">
            {strengthCategories.map((category) => (
              <div key={category.category}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.strengths.map((strength) => (
                    <button
                      key={strength}
                      onClick={() => {
                        toggleStrength(strength)
                        if (errors.strengths) setErrors({ ...errors, strengths: false })
                      }}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${
                        selectedStrengths.includes(strength)
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                      }`}
                    >
                      {strength}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {errors.strengths && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Please select at least one strength that describes you</p>
            </div>
          )}

          {selectedStrengths.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                You've identified {selectedStrengths.length} strength{selectedStrengths.length !== 1 ? "s" : ""}:
              </p>
              <p className="text-gray-700 font-medium">{selectedStrengths.join(", ")}</p>
            </div>
          )}
        </Card>

        {/* Reflection Exercises */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Strengths in Action</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Think of a time when you used one of your strengths to overcome a challenge. What happened?
              </label>
              <textarea
                value={strengthStory}
                onChange={(e) => {
                  setStrengthStory(e.target.value)
                  if (errors.story) setErrors({ ...errors, story: false })
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[120px] ${
                  errors.story ? "border-red-500 border-2" : "border-gray-300"
                }`}
                placeholder="For example: 'I used my determination when things got tough at work. Even when I felt like giving up, I kept going and eventually...'"
              />
              {errors.story && <p className="text-sm text-red-600 mt-1">This field is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How can you use your strengths to support your wellbeing and recovery?
              </label>
              <textarea
                value={futureUse}
                onChange={(e) => {
                  setFutureUse(e.target.value)
                  if (errors.future) setErrors({ ...errors, future: false })
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[120px] ${
                  errors.future ? "border-red-500 border-2" : "border-gray-300"
                }`}
                placeholder="For example: 'I can use my creativity to find new ways to cope when I'm stressed, and my loyalty to stay connected with supportive people...'"
              />
              {errors.future && <p className="text-sm text-red-600 mt-1">This field is required</p>}
            </div>
          </div>
        </Card>

        {/* Remember Your Strengths */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Remember Your Strengths</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            When you're having a difficult day, come back to this list of your strengths. They don't disappear just
            because you're struggling – they're always part of who you are.
          </p>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-gray-700 italic">
              "You are stronger than you think, braver than you believe, and more capable than you imagine."
            </p>
          </div>
        </Card>

        <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="w-full">
          {isCompleting ? "Completing..." : "Complete Module"}
        </Button>

        {showDialog && (
          <ModuleCompletionDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            moduleSlug="recognizing-strengths"
            moduleName="Recognizing Your Strengths"
            keyLearning="Identifying your personal strengths and understanding how to use them to support your recovery and wellbeing"
            nextModule={{
              name: "STOP Skill",
              slug: "stop-skill",
            }}
          />
        )}
      </div>
    </div>
  )
}
