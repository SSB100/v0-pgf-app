import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PublicHeader } from "@/components/layout/public-header"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Frequently Asked Questions</h1>
            <p className="text-xl text-primary/70">Clear information about what Waypoint does, and what it does not do.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">What is Waypoint?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Waypoint is a developing self-guided recovery and wellbeing platform for adults. It includes onboarding, Daily Reflections, learning and skills modules, values work, progress views, support information and an optional peer community. It is a support tool, not a health service or clinical treatment programme.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">Is Waypoint free to use?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  The current MVP provides its core user features without a charge. Waypoint is still under development, so future organisational or professional features may use a different funding model.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">What areas can I use Waypoint for?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  During setup, you can choose one or more focus areas including gambling, alcohol, other substance use, mental wellbeing, gaming-related concerns and personal growth. Waypoint is not designed to diagnose any condition, and its tools may not be suitable for every person or situation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">Is the content clinically validated?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Waypoint's learning content is informed by established concepts used in approaches such as CBT, DBT, ACT and mindfulness. The Waypoint intervention as a whole has not yet been clinically validated, and the content is undergoing further professional, cultural and research review.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">How do Journey Modules work?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Journey modules are self-guided learning experiences with practical exercises and reflection prompts. Completing a module adds to your Waypoint engagement progress and can be reflected by a Growth Companion if you choose to use one. That progress reflects activity in the app; it is not a clinical measure of recovery or wellbeing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">What are Daily Reflections?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Daily Reflections let you record self-reported information such as mood, urges, emotions, skills used and relevant behaviours. Your dashboard can show patterns in what you have entered over time. Waypoint does not interpret those entries as a diagnosis or clinical assessment.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">What is the Growth Companion?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  A Growth Companion is an optional visual way to recognise your engagement with Waypoint. It can change as you complete selected activities and apply Growth Credits. You can instead choose Progress only and keep the same credits and engagement levels without a character. A higher level does not mean that you are "more recovered" or clinically healthier than someone at a different level.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">What happens if I need urgent support?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Waypoint provides a support page with verified New Zealand emergency and helpline information. Waypoint itself is not monitored for emergencies and opening a support page does not notify a clinician or support worker. If you or someone else is in immediate danger, call 111 or go to the nearest hospital emergency department.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">How is my information handled?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Waypoint stores account and wellbeing information needed to provide its features. The platform is still undergoing privacy and security hardening before any formal health-service or research deployment. We will not describe data as anonymous, encrypted or shared in a particular way unless the implemented system supports that claim. Formal privacy information will be maintained in Waypoint's Privacy Policy as it is developed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">Can Waypoint replace therapy, counselling or treatment?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  No. Waypoint is intended to complement professional support and give you a structured place to reflect and practise skills between appointments or in everyday life. Decisions about medical or clinical care should be made with appropriately qualified professionals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">How do I get started?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  Create an adult account and complete guided onboarding to establish your starting self-reported baseline. The onboarding asks about the areas you want support with, relevant history and patterns, your values and strengths, and includes your first Daily Reflection and Growth Companion choice. This gives Waypoint a meaningful starting point for later reflection and personalisation. Some preferences can still be changed later in Settings. The current MVP is intended for people aged 18 and over.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">What if I return to a behaviour I am trying to change?</AccordionTrigger>
                <AccordionContent className="text-primary/70">
                  One difficult day does not erase the work you have already done. Waypoint is designed to let you record what happened without judgement, notice patterns and decide what support or skills may be useful next. If you are concerned about your safety or wellbeing, professional support may be appropriate.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary">Want to see how it works?</h2>
            <p className="text-lg text-primary/70">Explore Waypoint and use the parts that feel useful for where you are right now.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/signup"><Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-lg px-8">Get Started Free</Button></Link>
              <Link href="/about"><Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">Learn More About Waypoint</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary/60">© 2026 Waypoint. Supporting reflection, recovery and wellbeing.</p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-primary/60 hover:text-primary transition-colors">About</Link>
              <Link href="/faq" className="text-sm text-primary/60 hover:text-primary transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
