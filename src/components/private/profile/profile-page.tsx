"use client";

import { DailyLogs } from "@/components/private/profile/daily-logs";
import { ProfileStatsCard } from "@/components/private/profile/profile-stats-card";
import { QuickActions } from "@/components/private/profile/quick-actions";
import { Button } from "@/components/ui/button";
import { PublicProfileLink } from "@/components/private/settings/public-profile-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAggregatedStats,
  getDailyAggregation,
} from "@/packages/database/user/profile";
import { getCurrentUsername } from "@/packages/database/user/username";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WhatsAppBanner } from "./whatsapp";

export function ProfilePage() {
  const [timeframe, setTimeframe] = useState(30);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["profile-stats", timeframe],
    queryFn: () => getAggregatedStats(timeframe),
  });

  const { data: dailyData, isLoading: dailyLoading } = useQuery({
    queryKey: ["daily-stats", selectedDate],
    queryFn: () => getDailyAggregation(selectedDate),
  });

  const { data: usernameData, isLoading: usernameLoading } = useQuery({
    queryKey: ["username"],
    queryFn: () => getCurrentUsername(),
  });

  const handleTimeframeChange = (days: number) => {
    setTimeframe(days);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  if (
    statsLoading ||
    dailyLoading ||
    usernameLoading ||
    !stats ||
    !dailyData ||
    !usernameData?.success
  ) {
    return (
      <div className="bg-black py-18">
        <div className="max-w-4xl mx-auto p-4">
          <Card className="bg-black/40">
            <CardHeader>
              <CardTitle className="font-mono text-white/90">
                Loading...
              </CardTitle>
              <CardDescription className="font-mono text-white/60">
                Fetching your health data
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black py-18">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
          <div>
            <h1 className="font-mono text-lg text-white/90">
              Profile Overview
            </h1>
            <p className="font-mono text-sm text-white/60">
              Track your health, sleep, and nutrition progress
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  handleDateChange(newDate);
                }}
                className="font-mono text-xs bg-red-500/20 hover:bg-red-500/30 border-0 flex-1 sm:flex-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDateChange(new Date())}
                className="font-mono text-xs bg-red-500/20 hover:bg-red-500/30 border-0 flex-1 sm:flex-none"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);
                  handleDateChange(newDate);
                }}
                className="font-mono text-xs bg-red-500/20 hover:bg-red-500/30 border-0 flex-1 sm:flex-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/settings")}
              className="font-mono text-xs bg-red-500/20 hover:bg-red-500/30 border-0 w-full sm:w-auto"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions />
        </div>

        {/* Whatsapp Banner */}
        <div className="mb-6">
          <WhatsAppBanner />
        </div>

        {/* Public Profile Link */}
        <div className="mb-6">
          <PublicProfileLink username={usernameData?.username} />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-red-500/20 border-0">
            <TabsTrigger
              value="overview"
              className="font-mono text-xs data-[state=active]:bg-red-500/80"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="daily"
              className="font-mono text-xs data-[state=active]:bg-red-500/80"
            >
              Daily Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="flex items-center justify-end space-x-2">
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
            <ProfileStatsCard stats={stats} />
          </TabsContent>

          <TabsContent value="daily">
            <DailyLogs onDateChange={handleDateChange} dailyData={dailyData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
