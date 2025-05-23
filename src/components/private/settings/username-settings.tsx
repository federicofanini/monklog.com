"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { PublicProfileLink } from "./public-profile-link";
import {
  checkUsernameAvailability,
  updateUsername,
  getCurrentUsername,
  type UsernameResponse,
} from "@/packages/database/user/username";

export function UsernameSettings() {
  const [username, setUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState<string | undefined>();
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkResult, setCheckResult] = useState<UsernameResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCurrentUsername();
  }, []);

  const fetchCurrentUsername = async () => {
    const result = await getCurrentUsername();
    if (result.success && result.username) {
      setCurrentUsername(result.username);
      setUsername(result.username);
    }
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    if (value === currentUsername) {
      setCheckResult(null);
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    try {
      const result = await checkUsernameAvailability(value);
      setCheckResult(result);
    } catch (error) {
      console.error("Error checking username:", error);
      toast.error("Failed to check username availability");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!checkResult?.success) return;

    setIsUpdating(true);
    try {
      const result = await updateUsername(username);
      if (result.success) {
        toast.success("Username updated successfully");
        setCurrentUsername(result.username);
        setIsEditing(false);
      } else {
        toast.error(result.error?.message || "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border border-red-500/20 rounded-lg p-6 space-y-4 bg-black/40">
      <div className="space-y-1">
        <div className="font-mono text-xs text-red-500 uppercase tracking-wider">
          Username
        </div>
        <div className="font-mono text-sm text-white/80">
          Set your unique username for your public profile
        </div>
      </div>

      {!isEditing && currentUsername ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-base text-white/90">
              {currentUsername}
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              className="h-8 px-3 font-mono text-xs hover:bg-red-500/20"
            >
              Edit
            </Button>
          </div>
          <PublicProfileLink username={currentUsername} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-white/60">
              Choose a username
            </Label>
            <div className="relative">
              <Input
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="bg-black/40 border-red-500/20 font-mono text-sm pr-10"
                placeholder="username"
              />
              {isChecking ? (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-white/40" />
              ) : checkResult ? (
                checkResult.success ? (
                  <Check className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
                ) : (
                  <X className="absolute right-3 top-2.5 h-4 w-4 text-red-500" />
                )
              ) : null}
            </div>
            {checkResult?.error && (
              <div className="font-mono text-xs text-red-500">
                {checkResult.error.message}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setUsername(currentUsername || "");
                setCheckResult(null);
              }}
              className="font-mono text-xs"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`transition-colors font-mono text-xs ${
                isUpdating || !checkResult?.success
                  ? "bg-red-500/50"
                  : "bg-red-500/80 hover:bg-red-500"
              }`}
              disabled={isUpdating || !checkResult?.success}
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Username
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
