import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm text-gray-400 uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
