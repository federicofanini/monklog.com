"use client";

import { Activity, Moon, Utensils, Plus } from "lucide-react";
import Link from "next/link";

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color?: string;
}

const quickActions: QuickActionProps[] = [
  {
    href: "/food",
    icon: <Utensils className="h-5 w-5" />,
    label: "Log Food",
    description: "Track your meals and nutrition",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    href: "/health",
    icon: <Activity className="h-5 w-5" />,
    label: "Log Health",
    description: "Record exercise and daily activities",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    href: "/sleep",
    icon: <Moon className="h-5 w-5" />,
    label: "Log Sleep",
    description: "Monitor your sleep quality",
    color: "from-blue-500/20 to-indigo-500/20",
  },
];

function QuickAction({
  href,
  icon,
  label,
  description,
  color = "from-red-500/20 to-red-500/20",
}: QuickActionProps) {
  return (
    <Link href={href} className="block group">
      <div
        className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${color} hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-500/20 transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
        <div className="relative p-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-black/20 p-3 group-hover:bg-black/40 transition-colors">
              <div className="text-red-500/80 group-hover:text-red-500/90 transition-colors">
                {icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-sm text-white/90 flex items-center group-hover:text-white transition-colors">
                {label}
                <Plus className="h-3 w-3 ml-2 text-red-500/80 group-hover:text-red-500 transition-colors" />
              </h3>
              <p className="font-mono text-xs text-white/60 group-hover:text-white/70 transition-colors">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {quickActions.map((action) => (
        <QuickAction key={action.href} {...action} />
      ))}
    </div>
  );
}
