import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PublicHeader } from "@/components/layout/public-header"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Frequently Asked Questions</h1>
            <p className="text-xl text-primary/70">
              Find answers to common questions about Waypoint and your recovery journey.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  What is Waypoint?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Waypoint is a comprehensive recovery companion app designed to support individuals recovering from
                  addiction and managing mental health challenges. We provide evidence-based tools, daily reflections,
                  skill-building modules, and a supportive community to help you navigate your recovery journey.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  Is Waypoint free to use?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Yes! Waypoint offers free access to all core features including journey modules, daily check-ins,
                  progress tracking, and community support. Our mission is to make recovery support accessible to
                  everyone who needs it.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  What types of addiction does Waypoint support?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Waypoint supports recovery from all types of addictions including substance use (alcohol, drugs),
                  gambling, behavioral addictions, and other compulsive behaviors. Our tools are designed to be
                  applicable across different recovery paths, with customizable modules to fit your specific needs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  Can Waypoint help with mental health challenges?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Absolutely. Our modules incorporate evidence-based therapeutic approaches like DBT and CBT that are
                  effective for managing anxiety, depression, emotional regulation, and other mental health challenges.
                  Many users find Waypoint helpful for both addiction recovery and mental wellness.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  How do Journey Modules work?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Journey modules are structured learning experiences that teach specific skills and concepts. Each
                  module includes educational content, interactive exercises, and reflection prompts. You earn credits
                  for completing modules, which help your growth tree level up. You can complete modules at your own
                  pace and in any order that makes sense for your journey.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  What are daily check-ins?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Daily check-ins are brief reflections where you track your mood, urge strength, emotions, and skills
                  used. This helps you build self-awareness, identify patterns, and monitor your progress over time.
                  Your check-in data is visualized in your dashboard so you can see trends and celebrate improvements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  What is the Growth Tree?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  The growth tree is a visual representation of your recovery progress. As you complete journey modules
                  and maintain your practice, you earn credits that help your tree grow and level up. It's a meaningful
                  way to see how far you've come and stay motivated on your journey.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  How does the SOS feature work?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  The SOS feature provides instant access to your personalized crisis support resources. You can set up
                  emergency contacts, helpline numbers, and grounding techniques that work for you. When you're in
                  distress, simply click the SOS button to access these resources immediately.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  Is my data private and secure?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Yes. We take your privacy seriously. All your personal information, reflections, and progress data are
                  encrypted and stored securely. We never share your data with third parties. You have full control over
                  your account and can delete your data at any time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  Can Waypoint replace therapy or treatment?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  No. Waypoint is a supportive tool designed to complement professional treatment, not replace it. We
                  strongly encourage users to work with qualified therapists, counselors, or treatment programs.
                  Waypoint can enhance your recovery by providing daily support and skill practice between sessions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  How do I get started?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Getting started is easy! Click "Get Started" to create your free account. You'll complete a brief
                  onboarding process that helps us understand your goals and customize your experience. Then you can
                  immediately start exploring journey modules, completing daily check-ins, and tracking your progress.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  What if I relapse or have a setback?
                </AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Setbacks are a normal part of recovery. Waypoint helps you track these moments without judgment, learn
                  from them, and keep moving forward. Your progress isn't erased by a setback. Use the tools, reach out
                  to the community, and remember that recovery is about progress, not perfection.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">Still Have Questions?</h2>
            <p className="text-lg text-primary/70">
              We're here to help. Start your journey today and discover how Waypoint can support your recovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary/60">© 2025 Waypoint. Supporting recovery journeys.</p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-primary/60 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/faq" className="text-sm text-primary/60 hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
