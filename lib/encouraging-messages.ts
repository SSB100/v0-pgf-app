// Encouraging messages for when streaks are broken or restarted
export const streakResetMessages = [
  "Recovery isn't about perfection, it's about persistence. Today is a new opportunity.",
  "Every expert was once a beginner. Starting again shows strength, not weakness.",
  "Your past progress wasn't lost, it was practice. You know you can do this.",
  "The path to change is rarely straight. What matters is that you keep moving forward.",
  "One setback doesn't erase your progress. You're building resilience with each attempt.",
  "Starting over means you haven't given up. That's the real victory.",
  "Growth happens in spirals, not straight lines. You're exactly where you need to be.",
  "Today you begin again, and that takes courage. Be proud of showing up.",
  "Your longest streak proves you have what it takes. You'll reach it again.",
  "Missing a day doesn't define you. Coming back does.",
]

export function getStreakResetMessage(previousStreak: number): string {
  const index = previousStreak % streakResetMessages.length
  return streakResetMessages[index]
}
