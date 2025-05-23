import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProfilePage } from "@/components/private/profile/profile-page";

export default function Profile() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[500px] w-full">
          <Loader2 className="h-8 w-8 animate-spin text-red-500/50" />
        </div>
      }
    >
      <ProfilePage />
    </Suspense>
  );
}
