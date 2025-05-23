"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileStatsCard } from "@/components/private/profile/profile-stats-card";
import { format } from "date-fns";
import { Activity, Brain, Heart, Medal, Star, Trophy } from "lucide-react";
import type { PublicProfile } from "@/packages/database/user/public-profile";
import { getPublicProfile } from "@/packages/database/user/public-profile";

interface PublicProfilePageProps {
  profile: PublicProfile;
  username: string;
}

export function PublicProfilePage({
  profile: initialProfile,
  username,
}: PublicProfilePageProps) {
  const [timeframe, setTimeframe] = useState(30);
  const [profile, setProfile] = useState(initialProfile);

  const handleTimeframeChange = async (days: number) => {
    setTimeframe(days);
    try {
      const updatedProfile = await getPublicProfile(username);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile.stats) {
    return (
      <div className="bg-black py-18">
        <div className="max-w-4xl mx-auto p-4">
          <Card className="bg-black/40">
            <CardHeader>
              <CardTitle className="font-mono text-white/90">
                Stats not available
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black py-18">
      <div className="max-w-4xl mx-auto p-4">
        {/* User Info */}
        <Card className="bg-black/40 border-red-500/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20 rounded-2xl border-2 border-red-500/20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-red-500/10 text-red-500 text-xl">
                  {profile.full_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="font-mono text-xl text-white/90 truncate">
                  {profile.full_name}
                </h1>
                <p className="font-mono text-sm text-white/60">
                  @{profile.username}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-red-500" />
                    <span className="font-mono text-sm text-white/60">
                      Level {profile.level}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Medal className="h-4 w-4 text-red-500" />
                    <span className="font-mono text-sm text-white/60">
                      {profile.mental_toughness_score}% Mental Toughness
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-red-500" />
                    <span className="font-mono text-sm text-white/60">
                      {profile.current_streak} Day Streak
                    </span>
                  </div>
                </div>
                <p className="font-mono text-xs text-white/40 mt-2">
                  Joined {format(new Date(profile.joined_at), "MMMM yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card className="bg-black/40 border-red-500/20 mb-6">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 rounded-lg">
                <Activity className="h-8 w-8 text-red-500" />
                <div>
                  <div className="font-mono text-sm text-white/60">
                    Daily Steps
                  </div>
                  <div className="font-mono text-lg text-white/90">
                    {profile.stats.health_trends.avg_daily_steps.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 rounded-lg">
                <Brain className="h-8 w-8 text-red-500" />
                <div>
                  <div className="font-mono text-sm text-white/60">
                    Sleep Score
                  </div>
                  <div className="font-mono text-lg text-white/90">
                    {profile.stats.sleep_trends.avg_weekly_score}/100
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 rounded-lg">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <div className="font-mono text-sm text-white/60">
                    Completion Rate
                  </div>
                  <div className="font-mono text-lg text-white/90">
                    {Math.round(profile.stats.completion_rate)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Stats */}
        <div className="flex items-center justify-end space-x-2 mb-4">
          <Button
            variant={timeframe === 7 ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange(7)}
            className={`font-mono text-xs ${
              timeframe === 7
                ? "bg-red-500/80 hover:bg-red-500"
                : "bg-red-500/20 hover:bg-red-500/30 border-0"
            }`}
          >
            7 Days
          </Button>
          <Button
            variant={timeframe === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange(30)}
            className={`font-mono text-xs ${
              timeframe === 30
                ? "bg-red-500/80 hover:bg-red-500"
                : "bg-red-500/20 hover:bg-red-500/30 border-0"
            }`}
          >
            30 Days
          </Button>
          <Button
            variant={timeframe === 90 ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange(90)}
            className={`font-mono text-xs ${
              timeframe === 90
                ? "bg-red-500/80 hover:bg-red-500"
                : "bg-red-500/20 hover:bg-red-500/30 border-0"
            }`}
          >
            90 Days
          </Button>
        </div>
        <ProfileStatsCard stats={profile.stats} />
      </div>
    </div>
  );
}
