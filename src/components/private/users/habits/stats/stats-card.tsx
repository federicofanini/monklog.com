"use client";

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
}

export function StatsCard({ title, value, unit }: StatsCardProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-baseline">
        <span className="text-4xl font-bold">{value}</span>
        <span className="text-gray-500 ml-2">{unit}</span>
      </div>
    </div>
  );
}
