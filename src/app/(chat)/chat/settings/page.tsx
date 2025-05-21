import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { getUserProfile } from "@/packages/database/user";
import type { UpdateSettingsInput } from "./actions";
import { initializeSettings } from "./actions";
import { SettingsForm } from "@/components/private/users/settings-form";

export default async function SettingsPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  const profile = await getUserProfile(user.id);

  if (!profile) {
    throw new Error("User profile not found");
  }

  // Initialize settings if they don't exist
  if (!profile.settings) {
    const { success, settings } = await initializeSettings(user.id);
    if (!success || !settings) {
      throw new Error("Failed to initialize settings");
    }
    profile.settings = settings;
  }

  // Map DB settings to input type
  const currentSettings: UpdateSettingsInput = {
    morningCheckinEnabled: profile.settings.morning_checkin_enabled,
    eveningLogEnabled: profile.settings.evening_log_enabled,
    mentorMessagesEnabled: profile.settings.mentor_messages_enabled,
    aggressiveToneEnabled: profile.settings.aggressive_tone_enabled,
    dailyChallengesEnabled: profile.settings.daily_challenges_enabled,
    publicProfile: profile.settings.public_profile,
    shareProgress: profile.settings.share_progress,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <SettingsForm userId={user.id} initialSettings={currentSettings} />
    </div>
  );
}
