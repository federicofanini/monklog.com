"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  updateSettings,
  //resetProgress,
  deleteAccount,
} from "@/app/(chat)/chat/settings/actions";
import type { UpdateSettingsInput } from "@/app/(chat)/chat/settings/actions";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/path";

interface SettingsFormProps {
  userId: string;
  initialSettings: UpdateSettingsInput;
}

export function SettingsForm({ userId, initialSettings }: SettingsFormProps) {
  const router = useRouter();

  return (
    <div className="container max-w-2xl py-8 space-y-8 mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your training environment
        </p>
      </div>

      <Card className="p-6 bg-black/40 space-y-6">
        <div className="space-y-2">
          <h2 className="font-mono text-red-500">NOTIFICATIONS</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="morning-check">Morning Check-in</Label>
              <Switch
                id="morning-check"
                checked={initialSettings.morningCheckinEnabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(userId, {
                    ...initialSettings,
                    morningCheckinEnabled: checked,
                  });
                  router.refresh();
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="evening-log">Evening Log Reminder</Label>
              <Switch
                id="evening-log"
                checked={initialSettings.eveningLogEnabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(userId, {
                    ...initialSettings,
                    eveningLogEnabled: checked,
                  });
                  router.refresh();
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mentor-msg">Mentor Messages</Label>
              <Switch
                id="mentor-msg"
                checked={initialSettings.mentorMessagesEnabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(userId, {
                    ...initialSettings,
                    mentorMessagesEnabled: checked,
                  });
                  router.refresh();
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-mono text-red-500">MENTOR PREFERENCES</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mentor-tone">Aggressive Tone</Label>
              <Switch
                id="mentor-tone"
                checked={initialSettings.aggressiveToneEnabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(userId, {
                    ...initialSettings,
                    aggressiveToneEnabled: checked,
                  });
                  router.refresh();
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-challenges">Daily Challenges</Label>
              <Switch
                id="daily-challenges"
                checked={initialSettings.dailyChallengesEnabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(userId, {
                    ...initialSettings,
                    dailyChallengesEnabled: checked,
                  });
                  router.refresh();
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-mono text-red-500">PRIVACY</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile">Public Profile</Label>
              <Switch
                id="public-profile"
                checked={initialSettings.publicProfile}
                onCheckedChange={async (checked) => {
                  await updateSettings(userId, {
                    ...initialSettings,
                    publicProfile: checked,
                  });
                  router.refresh();
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="share-progress">Share Progress</Label>
              <Switch
                id="share-progress"
                checked={initialSettings.shareProgress}
                onCheckedChange={async (checked) => {
                  await updateSettings(userId, {
                    ...initialSettings,
                    shareProgress: checked,
                  });
                  router.refresh();
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-black/40 space-y-4">
        <h2 className="font-mono text-red-500">DANGER ZONE</h2>
        <div className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Reset Progress</h3>
              <p className="text-sm text-muted-foreground">
                Clear all logs and start fresh
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirm("Are you sure? This action cannot be undone.")) {
                  await resetProgress(userId);
                  router.refresh();
                }
              }}
            >
              Reset
            </Button>
          </div> */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirm("Are you sure? This action cannot be undone.")) {
                  await deleteAccount(userId);
                  router.push(paths.api.login);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
