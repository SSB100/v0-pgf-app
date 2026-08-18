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
            <p className="text-lg text-primary font-medium text-pretty mb-2">Set up Waypoint around what matters to you</p>
            <p className="text-sm text-muted-foreground text-pretty">
              People come to Waypoint for different reasons, including gambling, alcohol or other substance use, mental wellbeing, gaming-related concerns and personal growth. There is no single right way to use it.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent rounded-xl p-5 border border-green-500/20">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3"><Star className="w-5 h-5 text-green-600" /> Starting with your own goals</h2>
          <div className="space-y-2">
            {[
              "Choose the areas you want to focus on",
              "Record only the information you are comfortable sharing with Waypoint",
              "Use the tools and modules that feel relevant to you",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-5 space-y-3 border border-primary/20">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> What Waypoint includes</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div><p className="text-sm font-medium text-foreground">Self-guided tools</p><p className="text-xs text-muted-foreground">Content informed by established approaches including DBT, ACT, CBT and mindfulness</p></div>
            </div>
            <div className="flex gap-3">
              <Heart className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div><p className="text-sm font-medium text-foreground">Personalisation</p><p className="text-xs text-muted-foreground">Your selected goals, values and journey areas shape parts of the experience</p></div>
            </div>
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div><p className="text-sm font-medium text-foreground">Optional peer community</p><p className="text-xs text-muted-foreground">A community-alias space for peer discussion, not professional counselling</p></div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-foreground">What happens next</h2>
          <p className="text-sm text-muted-foreground">We'll ask questions about the areas you choose, your current patterns, values and strengths. These questions personalise Waypoint; they are not a diagnosis or clinical assessment.</p>
          <div className="space-y-2">
            {[
              ["1", "Your focus", "Choose the areas you want to work on"],
              ["2", "Awareness", "Reflect on emotions, situations and patterns"],
              ["3", "Values and strengths", "Identify what matters to you and resources you can draw on"],
              ["4", "Practical tools", "Explore self-guided skills for urges, emotions and everyday situations"],
            ].map(([number, title, description]) => (
              <div key={number} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{number}</div>
                <div><p className="text-sm font-medium text-foreground">{title}</p><p className="text-xs text-muted-foreground">{description}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            You can move through onboarding at your own pace. Difficult answers do not mean you have failed, and Waypoint is not here to judge what your progress should look like.
          </p>
        </div>

        <Button onClick={onNext} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base h-12">Continue</Button>
      </CardContent>
    </Card>
  )
}
