import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export function StatsCard({ icon: Icon, label, value, color = "primary" }: StatsCardProps) {
  return (
    <div className="bg-gray-900/30 border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
      <div className={cn("p-3.5 rounded-xl", color === "primary" && "bg-primary/20 text-primary shadow-[0_0_20px_rgba(179,0,255,0.15)]", color === "secondary" && "bg-secondary/20 text-secondary shadow-[0_0_20px_rgba(255,0,204,0.15)]", color === "accent" && "bg-accent/20 text-accent shadow-[0_0_20px_rgba(212,175,55,0.15)]", color === "green" && "bg-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]")}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
