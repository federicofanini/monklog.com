"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        size="sm"
        className="font-mono text-xs text-white/60 hover:text-white/90 hover:bg-red-500/20"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {label}
      </Button>
    </Link>
  );
}
