"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, MessageSquare, Shield, Users } from "lucide-react";

interface WhatsAppBannerProps {
  groupLink?: string;
}

export function WhatsAppBanner({
  groupLink = "https://chat.whatsapp.com/FShWFRgFcPL4WGUXQ7pB2Z",
}: WhatsAppBannerProps) {
  const features = [
    {
      icon: Users,
      text: "Connect with fellow warriors",
    },
    {
      icon: Shield,
      text: "Private, vetted community",
    },
    {
      icon: MessageSquare,
      text: "Daily accountability",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="font-mono text-xs text-white/60">Community Access</div>
      <div className="border border-green-500/20 rounded-lg bg-black/40 overflow-hidden">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-mono text-lg font-semibold text-white">
                MonkLog Warriors
              </h3>
              <p className="font-mono text-sm text-white/60">
                Join our private WhatsApp community
              </p>
            </div>
            <Button
              asChild
              className="h-9 w-full sm:w-auto px-4 font-mono text-xs bg-green-500/80 hover:bg-green-500 text-white border-0 flex items-center justify-center space-x-2"
            >
              <a
                href={groupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <span>JOIN NOW</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10"
              >
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <feature.icon className="h-4 w-4 text-green-500" />
                </div>
                <span className="font-mono text-sm text-white/80">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="space-y-2 border-t border-green-500/10 pt-4">
            <div className="font-mono text-xs text-white/40">
              Community Rules
            </div>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 font-mono text-xs text-white/60">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                <span>
                  No excuses, no complaints - only solutions and progress
                </span>
              </li>
              <li className="flex items-center space-x-2 font-mono text-xs text-white/60">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                <span>Share your wins and lessons learned from failures</span>
              </li>
              <li className="flex items-center space-x-2 font-mono text-xs text-white/60">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                <span>Support and challenge each other to grow stronger</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
