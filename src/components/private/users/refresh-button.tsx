"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";

interface HardUpdateProps {
  action: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  buttonText?: string;
}

export function HardUpdate({
  action,
  successMessage = "Refreshed successfully",
  errorMessage = "Failed to refresh",
  buttonText = "Refresh",
}: HardUpdateProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        await action();

        router.refresh();
        toast.success(successMessage);
      } catch (error) {
        console.error("Refresh error:", error);
        toast.error(error instanceof Error ? error.message : errorMessage);
      }
    });
  };

  return (
    <Button variant="secondary" onClick={handleRefresh} disabled={isPending}>
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Refreshing..." : buttonText}
    </Button>
  );
}
