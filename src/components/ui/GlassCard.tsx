import { cn } from "@/lib/utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass p-6 rounded-2xl",
        hover && "hover:border-primary/50 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}
