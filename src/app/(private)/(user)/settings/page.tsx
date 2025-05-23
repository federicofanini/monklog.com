import { Suspense } from "react";
import { SettingsPage } from "@/components/private/settings/settings-page";
import { Loader2 } from "lucide-react";

export default function Settings() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[500px] w-full">
          <Loader2 className="h-8 w-8 animate-spin text-red-500/50" />
        </div>
      }
    >
      <SettingsPage />
    </Suspense>
  );
}
