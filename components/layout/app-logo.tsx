import type { AppLogoProps } from "./app-logo.props"

export function AppLogo({ size = "md", showText = true, className = "", layout = "horizontal" }: AppLogoProps) {
  const textSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  }

  const iconSizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  }

  const layoutClasses = layout === "vertical" ? "flex-col items-center gap-2" : "flex items-center gap-3"

  return (
    <div className={`flex ${layoutClasses} ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className={`${iconSizeClasses[size]} font-bold leading-none`}>
          <svg viewBox="0 0 100 100" className="w-[1em] h-[1em]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" className="fill-primary opacity-20" />
            <circle cx="50" cy="50" r="30" className="fill-primary opacity-40" />
            <circle cx="50" cy="50" r="15" className="fill-primary" />
            <path d="M50 10 L70 40 L50 35 L30 40 Z" className="fill-primary opacity-80" />
            {/* </CHANGE> */}
          </svg>
        </div>
      </div>
      {showText && (
        <div className={`flex flex-col ${layout === "vertical" ? "items-center text-center" : ""}`}>
          <span className={`font-bold leading-tight ${textSizeClasses[size]} text-primary`}>Waypoint</span>
          {/* </CHANGE> */}
        </div>
      )}
    </div>
  )
}

export default AppLogo
