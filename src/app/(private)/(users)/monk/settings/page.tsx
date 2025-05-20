import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { getUserProfile } from "@/packages/database/user";
import { updateSettings, resetProgress, deleteAccount } from "./actions";
import type { UpdateSettingsInput } from "./actions";

export default async function SettingsPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  const profile = await getUserProfile(user.id);
  const settings = profile.settings;

  // Map DB settings to input type
  const currentSettings: UpdateSettingsInput = {
    morningCheckinEnabled: settings.morning_checkin_enabled,
    eveningLogEnabled: settings.evening_log_enabled,
    mentorMessagesEnabled: settings.mentor_messages_enabled,
    aggressiveToneEnabled: settings.aggressive_tone_enabled,
    dailyChallengesEnabled: settings.daily_challenges_enabled,
    publicProfile: settings.public_profile,
    shareProgress: settings.share_progress,
  };

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
                checked={settings.morning_checkin_enabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(user.id, {
                    ...currentSettings,
                    morningCheckinEnabled: checked,
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="evening-log">Evening Log Reminder</Label>
              <Switch
                id="evening-log"
                checked={settings.evening_log_enabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(user.id, {
                    ...currentSettings,
                    eveningLogEnabled: checked,
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mentor-msg">Mentor Messages</Label>
              <Switch
                id="mentor-msg"
                checked={settings.mentor_messages_enabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(user.id, {
                    ...currentSettings,
                    mentorMessagesEnabled: checked,
                  });
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
                checked={settings.aggressive_tone_enabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(user.id, {
                    ...currentSettings,
                    aggressiveToneEnabled: checked,
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-challenges">Daily Challenges</Label>
              <Switch
                id="daily-challenges"
                checked={settings.daily_challenges_enabled}
                onCheckedChange={async (checked) => {
                  await updateSettings(user.id, {
                    ...currentSettings,
                    dailyChallengesEnabled: checked,
                  });
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
                checked={settings.public_profile}
                onCheckedChange={async (checked) => {
                  await updateSettings(user.id, {
                    ...currentSettings,
                    publicProfile: checked,
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="share-progress">Share Progress</Label>
              <Switch
                id="share-progress"
                checked={settings.share_progress}
                onCheckedChange={async (checked) => {
                  await updateSettings(user.id, {
                    ...currentSettings,
                    shareProgress: checked,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-black/40 space-y-4">
        <h2 className="font-mono text-red-500">DANGER ZONE</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
                  await resetProgress(user.id);
                }
              }}
            >
              Reset
            </Button>
          </div>
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
                  await deleteAccount(user.id);
                  redirect(paths.api.login);
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
