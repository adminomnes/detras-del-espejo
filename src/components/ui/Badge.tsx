import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
        variant === "primary" && "bg-primary/20 text-primary",
        variant === "secondary" && "bg-secondary/20 text-secondary",
        variant === "accent" && "bg-accent/20 text-accent",
        variant === "default" && "glass text-gray-300",
        className
      )}
    >
      {children}
    </span>
  );
}
