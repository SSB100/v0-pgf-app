export const inspirationalQuotes = [
  "Every moment is a chance to begin again.",
  "Progress, not perfection.",
  "You are stronger than your urges.",
  "One day at a time, one choice at a time.",
  "Recovery is not linear, and that's okay.",
  "Your past does not define your future.",
  "Small steps lead to big changes.",
  "You are capable of more than you know.",
  "Healing takes time, be patient with yourself.",
  "Every choice you make is a vote for the person you're becoming.",
  "Courage doesn't mean you're not afraid, it means you act anyway.",
  "You've survived 100% of your worst days.",
  "Recovery is a journey, not a destination.",
  "The best time to start is now.",
  "Your story isn't over yet.",
  "Relapse is not failure, it's part of the process.",
  "Be kind to yourself, you're doing the best you can.",
  "Growth happens in the uncomfortable moments.",
  "You are not alone in this journey.",
  "Today's choices create tomorrow's life.",
  "Strength grows when you think you can't go on but keep going anyway.",
  "Your worth is not measured by your struggles.",
  "Every urge you resist is a victory.",
  "The pain you feel today is the strength you feel tomorrow.",
  "You are writing your own comeback story.",
  "It's okay to ask for help.",
  "Your mental health matters more than any bet.",
  "Recovery is possible, and you're proof of that.",
  "You are more than your addiction.",
  "Today is a gift, that's why it's called the present.",
  "Your feelings are valid, and so is your recovery.",
  "Progress is progress, no matter how small.",
  "You've already shown incredible courage by being here.",
  "The only way out is through.",
  "You are creating new patterns, one day at a time.",
  "Your future self will thank you for the choices you make today.",
  "Recovery is the best investment you'll ever make.",
  "You are not your mistakes.",
  "Every moment of resistance builds resilience.",
  "Your life has value beyond measure.",
  "Healing is not a straight line.",
  "You are exactly where you need to be right now.",
  "The urge will pass, it always does.",
  "You're not just surviving, you're learning to thrive.",
  "Your potential is unlimited.",
  "Recovery gives you your life back.",
  "You deserve peace and happiness.",
  "Every sunrise is a new opportunity.",
  "You are becoming who you were meant to be.",
  "Believe in the person you are becoming.",
]

// Get a consistent quote based on the user ID and last check-in date
export function getQuoteForCheckin(userId: string, checkinDate?: Date): string {
  const dateStr = checkinDate ? checkinDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  const seed = `${userId}-${dateStr}`

  // Simple hash function to get consistent index
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  const index = Math.abs(hash) % inspirationalQuotes.length
  return inspirationalQuotes[index]
}
