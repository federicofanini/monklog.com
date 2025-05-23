"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  togglePublicProfile,
  getPublicProfileStatus,
} from "@/packages/database/user/username";
import { PublicProfileLink } from "./public-profile-link";

interface PublicProfileSettingsProps {
  username?: string;
}

export function PublicProfileSettings({
  username,
}: PublicProfileSettingsProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function fetchInitialStatus() {
      try {
        const status = await getPublicProfileStatus();
        if (status.success) {
          setIsPublic(status.isPublic || false);
        } else {
          toast.error(status.error?.message || "Failed to load profile status");
        }
      } catch (error) {
        console.error("Error loading profile status:", error);
        toast.error("Failed to load profile status");
      } finally {
        setIsInitializing(false);
      }
    }

    fetchInitialStatus();
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await togglePublicProfile();
      if (response.success) {
        setIsPublic(response.isPublic || false);
        toast.success(
          `Public profile ${response.isPublic ? "enabled" : "disabled"}`
        );
      } else {
        toast.error(
          response.error?.message || "Failed to toggle public profile"
        );
      }
    } catch (error) {
      console.error("Error toggling public profile:", error);
      toast.error("Failed to toggle public profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-red-500/20 rounded-lg p-6 space-y-4 bg-black/40">
      <div className="space-y-1">
        <div className="font-mono text-xs text-red-500 uppercase tracking-wider">
          Public Profile
        </div>
        <div className="font-mono text-sm text-white/80">
          Control the visibility of your profile
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Globe className="h-4 w-4 text-red-500" />
          </div>
          <div className="space-y-1">
            <Label className="font-mono text-sm text-white/90">
              Make profile public
            </Label>
            <div className="font-mono text-xs text-white/60">
              Allow others to view your profile and progress
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {(isLoading || isInitializing) && (
            <Loader2 className="h-4 w-4 animate-spin text-white/40" />
          )}
          <Switch
            checked={isPublic}
            onCheckedChange={handleToggle}
            disabled={isLoading || isInitializing || !username}
            className="data-[state=checked]:bg-red-500"
          />
        </div>
      </div>

      {username && <PublicProfileLink username={username} />}
    </div>
  );
}
