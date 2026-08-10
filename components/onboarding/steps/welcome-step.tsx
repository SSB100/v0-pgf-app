"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AppLogo from "@/components/layout/app-logo"
import { Heart, Shield, Users, Sparkles, CheckCircle, Star } from "lucide-react"

interface WelcomeStepProps {
  userName: string
  onNext: () => void
}

export default function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardContent className="pt-8 pb-8 px-6 md:px-8 space-y-6">
        <div className="text-center space-y-4">
          <AppLogo size="lg" showText={true} className="justify-center mb-4" />

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3 text-balance">Welcome, {userName}</h1>
            <p className="text-lg text-primary font-medium text-pretty mb-2">
              You've taken a powerful first step
            </p>
            <p className="text-sm text-muted-foreground text-pretty">
              By showing up today, you've already demonstrated courage and commitment to positive change. Whatever brought you here—addiction recovery, mental health, or personal growth—you're not alone. Let's begin.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent rounded-xl p-5 border border-green-500/20">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-green-600" />
            You've Already Achieved Something
          </h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">Recognized you want to make a change</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">Took action by signing up today</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">Showed courage by starting your journey</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-5 space-y-3 border border-primary/20">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Waypoint Helps You Succeed
          </h2>

          <div className="space-y-3">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Evidence-Based Tools</p>
                <p className="text-xs text-muted-foreground">DBT, mindfulness, and cognitive techniques proven to work</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Heart className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Personalized to You</p>
                <p className="text-xs text-muted-foreground">Adapts to your specific needs and goals</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Community Support</p>
                <p className="text-xs text-muted-foreground">Connect, stay accountable, and grow together</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-foreground">What Happens Next</h2>
          <p className="text-sm text-muted-foreground">
            We'll ask questions to understand your situation and goals. No wrong answers. You can save at any time.
          </p>

          <div className="space-y-2">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Your journey</p>
                <p className="text-xs text-muted-foreground">Tell us what areas you need support with</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Self-awareness</p>
                <p className="text-xs text-muted-foreground">Explore your emotions, triggers, and patterns</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Values & strengths</p>
                <p className="text-xs text-muted-foreground">Identify what matters most to guide your decisions</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                4
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Practical skills</p>
                <p className="text-xs text-muted-foreground">Learn techniques for managing urges and emotions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            <span className="font-semibold text-green-700">You've got this.</span> Recovery and change are possible. We're here to help you find your way.
          </p>
        </div>

        <Button
          onClick={onNext}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base h-12"
        >
          Let's Begin My Journey
        </Button>
      </CardContent>
    </Card>
  )
}
