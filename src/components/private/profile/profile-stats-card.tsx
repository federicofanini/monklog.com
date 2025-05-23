import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AggregatedStats } from "@/packages/database/user/profile";
import { Activity, Brain, Heart, Utensils } from "lucide-react";

interface ProfileStatsCardProps {
  stats: AggregatedStats;
}

export function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Health Card */}
      <Card className="bg-black/40 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-mono text-xs text-white/90">
            Health Overview
          </CardTitle>
          <Activity className="h-4 w-4 text-red-500/80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-mono text-white/90">
                {stats.health_trends.avg_daily_steps.toLocaleString()}
              </p>
              <p className="font-mono text-xs text-white/60">
                Avg. Daily Steps
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60">
                  Exercise Minutes
                </span>
                <span className="font-mono text-white/90">
                  {stats.health_trends.total_exercise_minutes} min
                </span>
              </div>
              <Progress
                value={
                  (stats.health_trends.exercise_distribution.cardio /
                    stats.health_trends.total_exercise_minutes) *
                  100
                }
                className="h-1 bg-red-500/20 [&>[role=progressbar]]:bg-red-500/80"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/60">
                <span>
                  Cardio: {stats.health_trends.exercise_distribution.cardio}min
                </span>
                <span>
                  Strength: {stats.health_trends.exercise_distribution.strength}
                  min
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60">Daily Water</span>
                <span className="font-mono text-white/90">
                  {Math.round(stats.health_trends.avg_daily_water)}ml
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Card */}
      <Card className="bg-black/40 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-mono text-xs text-white/90">
            Sleep Quality
          </CardTitle>
          <Brain className="h-4 w-4 text-red-500/80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-mono text-white/90">
                {stats.sleep_trends.avg_weekly_score}/100
              </p>
              <p className="font-mono text-xs text-white/60">
                Avg. Sleep Score
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60">Sleep Duration</span>
                <span className="font-mono text-white/90">
                  {Math.round(stats.sleep_trends.avg_weekly_duration / 60)}h{" "}
                  {Math.round(stats.sleep_trends.avg_weekly_duration % 60)}m
                </span>
              </div>
              <Progress
                value={
                  (stats.sleep_trends.avg_weekly_duration / (8 * 60)) * 100
                }
                className="h-1 bg-red-500/20 [&>[role=progressbar]]:bg-red-500/80"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/60">
                <span>Best: {stats.sleep_trends.best_sleep_day}</span>
                <span>Worst: {stats.sleep_trends.worst_sleep_day}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Card */}
      <Card className="bg-black/40 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-mono text-xs text-white/90">
            Nutrition
          </CardTitle>
          <Utensils className="h-4 w-4 text-red-500/80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-mono text-white/90">
                {Math.round(stats.nutrition_trends.avg_weekly_quality)}/10
              </p>
              <p className="font-mono text-xs text-white/60">
                Avg. Food Quality
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60">Weekly Calories</span>
                <span className="font-mono text-white/90">
                  {Math.round(stats.nutrition_trends.avg_weekly_calories)}
                </span>
              </div>
              <p className="font-mono text-xs text-white/60 mt-2">
                Macro Distribution
              </p>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-red-500/20">
                <div
                  className="bg-red-500/80"
                  style={{
                    width: `${stats.nutrition_trends.macro_distribution.protein_percentage}%`,
                  }}
                />
                <div
                  className="bg-red-500/60"
                  style={{
                    width: `${stats.nutrition_trends.macro_distribution.carbs_percentage}%`,
                  }}
                />
                <div
                  className="bg-red-500/40"
                  style={{
                    width: `${stats.nutrition_trends.macro_distribution.fat_percentage}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/60">
                <span>Protein</span>
                <span>Carbs</span>
                <span>Fat</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress Card */}
      <Card className="bg-black/40 border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-mono text-xs text-white/90">
            Overall Progress
          </CardTitle>
          <Heart className="h-4 w-4 text-red-500/80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-mono text-white/90">
                {Math.round(stats.completion_rate)}%
              </p>
              <p className="font-mono text-xs text-white/60">Completion Rate</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60">Days Logged</span>
                <span className="font-mono text-white/90">
                  {stats.total_days_logged} days
                </span>
              </div>
              <Progress
                value={stats.completion_rate}
                className="h-1 bg-red-500/20 [&>[role=progressbar]]:bg-red-500/80"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/60">
                  Mood Distribution
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[10px] font-mono text-white/60">
                {Object.entries(stats.health_trends.mood_distribution).map(
                  ([mood, count]) => (
                    <div key={mood} className="text-center">
                      <div className="h-1.5 bg-red-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500/80"
                          style={{
                            width: `${
                              (count / stats.total_days_logged) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span>{mood}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
