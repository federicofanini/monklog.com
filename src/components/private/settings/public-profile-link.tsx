"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowRight, Globe, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PublicProfileLinkProps {
  username?: string;
}

export function PublicProfileLink({ username }: PublicProfileLinkProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const publicUrl = username ? `monklog.com/${username}` : null;

  const copyToClipboard = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(`https://${publicUrl}`);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-mono text-xs text-white/60">Public Profile Link</div>
      {username ? (
        <div className="border border-red-500/20 rounded-lg bg-black/40 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3">
            <div className="flex items-start sm:items-center space-x-3 w-full sm:w-auto">
              <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                <Globe className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`https://monklog.com/${username}`}
                  className="group flex items-center space-x-1.5 hover:text-red-500 transition-colors"
                  target="_blank"
                >
                  <div className="font-mono text-sm text-white/90 group-hover:text-red-500 transition-colors truncate">
                    {publicUrl}
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
                <div className="font-mono text-xs text-white/50">
                  Share your profile with others
                </div>
              </div>
            </div>
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              className="h-9 w-full sm:w-auto px-4 font-mono text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 border-0 flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy URL</span>
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-red-500/40 rounded-lg bg-red-500/5 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3">
            <div className="space-y-1">
              <div className="font-mono text-sm text-red-500">
                Set up your public profile
              </div>
              <div className="font-mono text-xs text-white/60">
                Create a username to share your profile with others
              </div>
            </div>
            <Button
              onClick={() => router.push("/settings")}
              variant="destructive"
              className="h-9 w-full sm:w-auto px-4 font-mono text-xs bg-red-500/80 hover:bg-red-500 flex items-center justify-center space-x-2"
            >
              <span>Set Username</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
