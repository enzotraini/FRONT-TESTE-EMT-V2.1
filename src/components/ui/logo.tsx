import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo/Ícone - Placeholder com design industrial */}
      <div className={cn(
        "flex items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900 shadow-lg",
        sizeClasses[size]
      )}>
        {/* Ícone de siderurgia/metalurgia simplificado */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-3/5 h-3/5 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Design industrial minimalista */}
          <path 
            d="M3 20h18v-2H3v2zm0-4h18v-2H3v2zm0-8v2h18V8H3zm0-4v2h18V4H3z" 
            fill="currentColor"
            opacity="0.8"
          />
          <path 
            d="M12 2L8 6h8l-4-4z" 
            fill="currentColor"
          />
          <circle 
            cx="12" 
            cy="12" 
            r="2" 
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Texto da empresa */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn(
            "font-bold text-slate-800 dark:text-slate-100 leading-tight tracking-tight",
            textSizeClasses[size]
          )}>
            Aço Fácil
          </h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            EMT Informática
          </span>
        </div>
      )}
    </div>
  );
} 