import { Suspense } from "react";
import { SleepPage } from "@/components/private/sleep/sleep-page";
import { Loader2 } from "lucide-react";

export default function LogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[500px] w-full">
          <Loader2 className="h-8 w-8 animate-spin text-red-500/50" />
        </div>
      }
    >
      <SleepPage />
    </Suspense>
  );
}
