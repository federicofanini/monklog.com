"use client";

import { BackButton } from "@/components/private/back-button";
import { UsernameSettings } from "./username-settings";
import { PublicProfileSettings } from "./public-profile-settings";
import { useState } from "react";

export function SettingsPage() {
  const [username, setUsername] = useState<string | undefined>();

  const handleUsernameUpdate = (newUsername: string | undefined) => {
    setUsername(newUsername);
  };

  return (
    <div className="bg-black py-18">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-2">
          <BackButton href="/profile" />
        </div>
        <div className="mb-6">
          <h1 className="font-mono text-lg text-white/90">Settings</h1>
          <p className="font-mono text-sm text-white/60">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-8">
          <UsernameSettings onUsernameUpdate={handleUsernameUpdate} />
          <PublicProfileSettings username={username} />
        </div>
      </div>
    </div>
  );
}
