"use client";

import { paths } from "@/lib/path";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function UpgradePrompt() {
  return (
    <Link
      href={paths.marketing.pricing}
      className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative overflow-hidden rounded-lg border border-red-500/20 bg-black/40 p-8 transition-colors hover:bg-black/60">
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-red-500/5" />
        <Zap className="h-8 w-8 text-red-500" />
        <h3 className="mt-4 text-xl font-bold text-white">Upgrade to Pro</h3>
        <p className="mt-2 text-sm text-white/70">
          Get unlimited access to all mentors and features. No more daily
          limits.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10">
              <ArrowRight className="h-3 w-3 text-red-500" />
            </div>
            <p className="text-sm text-white/70">Unlimited daily messages</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10">
              <ArrowRight className="h-3 w-3 text-red-500" />
            </div>
            <p className="text-sm text-white/70">
              Access to all mentor personas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10">
              <ArrowRight className="h-3 w-3 text-red-500" />
            </div>
            <p className="text-sm text-white/70">Priority response time</p>
          </div>
        </div>
        <div className="mt-6 w-full bg-red-500 font-mono text-sm hover:bg-red-600 py-2 px-4 rounded-md text-center text-white">
          UPGRADE NOW
        </div>
      </div>
    </Link>
  );
}
