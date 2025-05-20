import { Card } from "@/components/ui/card";

export function AchievementCard({
  name,
  description,
  icon,
  points,
  isUnlocked = true,
}: {
  name: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked?: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div
          className={`w-16 h-16 rounded-full ${
            isUnlocked
              ? "bg-yellow-100 dark:bg-yellow-900/20"
              : "bg-gray-100 dark:bg-gray-800"
          } flex items-center justify-center`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h4 className="text-lg font-medium">{name}</h4>
          <p className="text-sm text-gray-500">
            {isUnlocked ? description : `${points} XP reward`}
          </p>
        </div>
      </div>
    </Card>
  );
}
