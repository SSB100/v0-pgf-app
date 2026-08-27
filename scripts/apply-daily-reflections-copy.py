from pathlib import Path
root=Path('.')

changes = {
'app/layout.tsx': [
('with reflection, check-ins, practical skills and support resources.', 'with reflection, Daily Reflections, practical skills and support resources.'),
],
'app/check-in/page.tsx': [
('Check-In Complete', 'Daily Reflection Complete'),
("You've already completed today's check-in. Come back tomorrow to log your next one.", "You've already completed today's Daily Reflection. Come back tomorrow for your next one."),
('>Daily Check-In<', '>Daily Reflection<'),
('Take a moment to reflect on your day and track your progress. Regular check-ins help you stay aware\n                  and build resilience.', 'Take a moment to reflect on your day and record what stands out. Daily Reflections can help you notice patterns\n                  and stay aware of what is changing over time.'),
],
'app/page.tsx': [
('check in with yourself and stay connected to the goals and values that matter to you.', 'use Daily Reflections and stay connected to the goals and values that matter to you.'),
('"Daily check-ins for mood, urges and patterns you choose to track"', '"Daily Reflections for mood, urges and patterns you choose to track"'),
('title: "Daily Check-Ins"', 'title: "Daily Reflections"'),
('See trends in your own check-ins and Waypoint activity', 'See trends in your own Daily Reflections and Waypoint activity'),
('your first Daily Check-in.', 'your first Daily Reflection.'),
('title: "Keep checking in"', 'title: "Use Daily Reflections"'),
],
'app/about/page.tsx': [
('Daily check-ins, values, goals and selected journey areas help tailor what you see.', 'Daily Reflections, values, goals and selected journey areas help tailor what you see.'),
('without treating a setback or missed check-in as failure.', 'without treating a setback or missed Daily Reflection as failure.'),
],
'app/faq/page.tsx': [
('It includes onboarding, daily check-ins, learning and skills modules', 'It includes onboarding, Daily Reflections, learning and skills modules'),
('What are daily check-ins?', 'What are Daily Reflections?'),
('Daily check-ins let you record self-reported information', 'Daily Reflections let you record self-reported information'),
('your first Daily Check-in and Growth Companion choice.', 'your first Daily Reflection and Growth Companion choice.'),
],
'app/privacy-policy/page.tsx': [
('<li>daily check-ins, urges, behaviour information, skills practice, Journey progress and reflections you choose to enter;</li>', '<li>Daily Reflections, urges, behaviour information, skills practice, Journey progress and reflections you choose to enter;</li>'),
('simply because summary check-in sharing is enabled.', 'simply because Daily Reflection summary sharing is enabled.'),
],
'app/onboarding/page.tsx': [
('your focus areas, values, strengths and first check-in.', 'your focus areas, values, strengths and first Daily Reflection.'),
],
'app/dashboard/page.tsx': [
('className="hidden max-w-md text-right text-sm text-muted-foreground lg:block">\n              See your growth progress first, then choose the next useful action for today.\n            </p>', 'className="invisible hidden max-w-md text-right text-sm text-muted-foreground lg:block" aria-hidden="true">\n              See your growth progress first, then choose the next useful action for today.\n            </p>'),
('className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${todayCheckIn ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-secondary text-muted-foreground"}`}>', 'className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${todayCheckIn ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "invisible bg-secondary text-muted-foreground"}`} aria-hidden={!todayCheckIn}>'),
('? "Today\'s check-in"', '? "Today\'s Daily Reflection"'),
(': "Your first check-in, when you\'re ready"}', ': "Your first Daily Reflection, when you\'re ready"}'),
('? "A short check-in can capture your mood, urges and anything that stood out. Skip it if today is not the day for it."', '? "A short Daily Reflection can capture your mood, urges and anything that stood out. Skip it if today is not the day for it."'),
(': "A check-in gives you a self-reported starting point that Waypoint can reflect back over time. It is optional, and you can explore the Journey first if you prefer."}', ': "A Daily Reflection gives you a self-reported starting point that Waypoint can reflect back over time. It is optional, and you can explore the Journey first if you prefer."}'),
('{hasCheckInHistory ? "Start check-in" : "Record first check-in"}', '{hasCheckInHistory ? "Start Daily Reflection" : "Record first Daily Reflection"}'),
],
'app/dashboard/[section]/page.tsx': [
('className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${todayCheckIn ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-secondary text-muted-foreground"}`}>', 'className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${todayCheckIn ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "invisible bg-secondary text-muted-foreground"}`} aria-hidden={!todayCheckIn}>'),
('{todayCheckIn ? "Your check-in is saved" : "How are things today?"}', '{todayCheckIn ? "Your Daily Reflection is saved" : "How are things today?"}'),
(': "A short check-in can capture mood, urges and what stood out. Skip it if it would not help today."}', ': "A short Daily Reflection can capture mood, urges and what stood out. Skip it if it would not help today."}'),
('{todayCheckIn ? "View check-ins" : "Open check-in"}', '{todayCheckIn ? "View Daily Reflections" : "Open Daily Reflection"}'),
('<MobileDashboardSectionShell title="Check-ins" description="Your recent entries at a glance">', '<MobileDashboardSectionShell title="Daily Reflections" description="Your recent entries at a glance">'),
('Missing a check-in is not treated as a good or bad result.', 'Missing a Daily Reflection is not treated as a good or bad result.'),
('No check-ins have been recorded in this seven-day window.', 'No Daily Reflections have been recorded in this seven-day window.'),
('Open daily check-in', 'Open Daily Reflection'),
],
'components/check-in/check-in-form.tsx': [
('Failed to save check-in', 'Failed to save Daily Reflection'),
('Failed to save your check-in. Please try again.', 'Failed to save your Daily Reflection. Please try again.'),
('This check-in records what you report today.', 'This Daily Reflection records what you report today.'),
('since your last check-in?', 'since your last Daily Reflection?'),
('Save Check-In', 'Save Daily Reflection'),
],
'components/dashboard/dashboard-header.tsx': [
('Your space to check in, learn, reflect and keep track of what matters to you.', 'Your space for Daily Reflections, learning and keeping track of what matters to you.'),
],
'components/dashboard/mobile-nav.tsx': [
('label: "Check-in"', 'label: "Reflection"'),
('aria-label="Today\'s check-in recorded"', 'aria-label="Today\'s Daily Reflection recorded"'),
],
'components/dashboard/growth-avatar-card.tsx': [
('Current check-in run', 'Current Daily Reflection run'),
],
'components/dashboard/mobile-growth-companion.tsx': [
('>Check in</p>', '>Daily Reflection</p>'),
('>Check-in run</p>', '>Daily Reflection run</p>'),
],
'components/dashboard/mobile-dashboard-home.tsx': [
('Check in or choose a next step', 'Start a Daily Reflection or choose a next step'),
('Check-in history', 'Daily Reflection history'),
('aria-label="Open seven-day check-in overview"', 'aria-label="Open seven-day Daily Reflection overview"'),
('no check-in recorded', 'no Daily Reflection recorded'),
],
'components/dashboard/current-state-card.tsx': [
('Your Recent Check-In', 'Your Recent Daily Reflection'),
('No check-in recorded yet', 'No Daily Reflection recorded yet'),
('Check-ins are optional and can help you look back at patterns over time.', 'Daily Reflections are optional and can help you look back at patterns over time.'),
],
'components/dashboard/weekly-overview-card.tsx': [
('"No check-in recorded"', '"No Daily Reflection recorded"'),
('No check-ins in this 7-day view yet', 'No Daily Reflections in this 7-day view yet'),
('When you record a check-in,', 'When you record a Daily Reflection,'),
('without a check-in.', 'without a Daily Reflection.'),
('Missing a check-in is not a failure.', 'Missing a Daily Reflection is not a failure.'),
('Self-reported check-ins', 'Self-reported Daily Reflections'),
('aria-label="Daily check-in status"', 'aria-label="Daily Reflection status"'),
],
'components/dashboard/growth-tree-card.tsx': [
('completing daily check-ins', 'completing Daily Reflections'),
('Check-in Streak', 'Daily Reflection Streak'),
],
'components/dashboard/suggested-skills-card.tsx': [
('Your recent check-ins included lower mood and stronger urges', 'Your recent Daily Reflections included lower mood and stronger urges'),
],
'components/dashboard/journey-progress-card.tsx': [
('<div className={`rounded-lg border border-primary/20 bg-primary/5 ${compact ? "p-2.5" : "mt-4 p-3"}`}>\n          <p className={compact ? "text-xs leading-relaxed text-muted-foreground" : "text-sm text-muted-foreground"}>\n            Dates, focus areas and app activity can help you reflect on patterns, but they do not by themselves show whether your health or recovery is improving.\n          </p>\n        </div>', '<div className={`invisible rounded-lg border border-primary/20 bg-primary/5 ${compact ? "p-2.5" : "mt-4 p-3"}`} aria-hidden="true">\n          <p className={compact ? "text-xs leading-relaxed text-muted-foreground" : "text-sm text-muted-foreground"}>\n            Dates, focus areas and app activity can help you reflect on patterns, but they do not by themselves show whether your health or recovery is improving.\n          </p>\n        </div>'),
],
'components/onboarding/steps/completion-step.tsx': [
('dashboard, check-ins and journey content', 'dashboard, Daily Reflections and journey content'),
('optional check-ins, self-guided modules', 'optional Daily Reflections, self-guided modules'),
],
'components/onboarding/steps/welcome-step.tsx': [
('["4", "Check-in", "Set a baseline"]', '["4", "Daily Reflection", "Set a baseline"]'),
],
'components/onboarding/steps/daily-checkin-step.tsx': [
('Your First Daily Check-In', 'Your First Daily Reflection'),
('Try the same check-in you can use day to day.', 'Try the same Daily Reflection you can use day to day.'),
('<span className="font-semibold">Why check in?</span>', '<span className="font-semibold">Why use Daily Reflections?</span>'),
('Future check-ins use the same basic structure', 'Future Daily Reflections use the same basic structure'),
('"Save First Check-In & Continue" : "Preparing Check-In..."', '"Save First Daily Reflection & Continue" : "Preparing Daily Reflection..."'),
],
'components/privacy/privacy-centre-client.tsx': [
('onboarding answers, daily check-ins, saved Journey responses', 'onboarding answers, Daily Reflections, saved Journey responses'),
('Private check-in notes remain excluded.', 'Private Daily Reflection notes remain excluded.'),
],
'components/professional/professional-dashboard-client.tsx': [
('Latest check-in:', 'Latest Daily Reflection:'),
('Private check-in free text', 'Private Daily Reflection free text'),
('Check-in window only', 'Daily Reflection window only'),
('title="Daily check-ins"', 'title="Daily Reflections"'),
('label="Check-ins"', 'label="Daily Reflections"'),
('Missing days mean no check-in was recorded.', 'Missing days mean no Daily Reflection was recorded.'),
],
'components/professional/connect-professional-client.tsx': [
('Private check-in notes remain excluded.', 'Private Daily Reflection notes remain excluded.'),
],
'lib/sharing-policy.ts': [
('label: "Daily check-in summaries"', 'label: "Daily Reflection summaries"'),
('description: "Selected trend and summary information from daily check-ins.', 'description: "Selected trend and summary information from Daily Reflections.'),
],
'lib/journey-plain-language-review.ts': [
('A simple check-in gives you information instead of a verdict.', 'A simple Daily Reflection gives you information instead of a verdict.'),
('A check-in is a weather report, not a school grade.', 'A Daily Reflection is a weather report, not a school grade.'),
],
'lib/journey-curriculum.ts': [
('without turning the check-in into a judgement.', 'without turning the Daily Reflection into a judgement.'),
('A daily check-in can capture what is happening right now:', 'A Daily Reflection can capture what is happening right now:'),
('One check-in is a snapshot. Several check-ins can show', 'One Daily Reflection is a snapshot. Several Daily Reflections can show'),
('best example of a descriptive check-in?', 'best example of a descriptive Daily Reflection?'),
('without turning each check-in into a judgement about progress.', 'without turning each Daily Reflection into a judgement about progress.'),
],
'lib/journey-self-guided-presentation-remaining.ts': [
('title: "A Two-Minute Check-In With Yourself"', 'title: "A Two-Minute Daily Reflection"'),
('A check-in helps you gather information instead of handing out a verdict.', 'A Daily Reflection helps you gather information instead of handing out a verdict.'),
('A check-in can work the same way:', 'A Daily Reflection can work the same way:'),
('One difficult check-in does not tell you very much.', 'One difficult Daily Reflection does not tell you very much.'),
('a useful check-in rather than a judgement?', 'a useful Daily Reflection rather than a judgement?'),
('A check-in is a description of today\'s conditions, not a score.', 'A Daily Reflection is a description of today\'s conditions, not a score.'),
],
}

missing=[]
for rel, reps in changes.items():
    p=root/rel
    text=p.read_text()
    for old,new in reps:
        if old not in text:
            missing.append((rel, old))
        else:
            text=text.replace(old,new)
    p.write_text(text)

if missing:
    print('MISSING REPLACEMENTS:')
    for rel, old in missing:
        print(rel, repr(old))
    raise SystemExit(2)
print('Applied Daily Reflection copy replacements to', len(changes), 'files')
