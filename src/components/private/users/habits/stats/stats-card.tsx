"use client";

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
}

export function StatsCard({ title, value, unit }: StatsCardProps) {
  return (
    <div className="p-6">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-medium">{value}</span>
        {unit && <span className="text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

export type { StatsCardProps };
