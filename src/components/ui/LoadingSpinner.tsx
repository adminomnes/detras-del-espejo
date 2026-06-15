import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "border-2 border-white/20 border-t-primary rounded-full animate-spin",
        size === "sm" && "w-5 h-5",
        size === "md" && "w-8 h-8",
        size === "lg" && "w-12 h-12",
        className
      )}
    />
  );
}
