import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { paths } from "@/lib/path";
import { Card } from "@/components/ui/card";
import { OnboardingFlow } from "@/components/sections/onboarding-flow";
import { getUserProfile } from "@/packages/database/user";

export default async function OnboardingPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  // Check if user has already completed onboarding
  const profile = await getUserProfile(user.id);
  if (profile?.settings) {
    redirect(paths.users.home);
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container max-w-2xl mx-auto space-y-8">
        <Card className="p-8 bg-black/40 space-y-6">
          <h1 className="text-2xl font-bold text-center">Welcome to MonkLog</h1>
          <p className="text-center text-muted-foreground">
            Let&apos;s set up your training environment. This will take about 2
            minutes.
          </p>

          <OnboardingFlow userId={user.id} />
        </Card>
      </div>
    </div>
  );
}
