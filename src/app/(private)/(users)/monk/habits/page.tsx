import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { getUserHabits } from "@/packages/database/user/habits";
import { HabitConfig } from "@/components/private/users/habit-config";
import { updateUserHabits } from "./actions";

export default async function HabitsPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  try {
    const habits = await getUserHabits(user.id);

    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Configure Habits</h1>
          <p className="text-muted-foreground">
            Select the habits you want to track daily. These will appear in your
            daily log and contribute to your mental toughness score.
          </p>
        </div>

        <HabitConfig
          habits={habits}
          onSave={async (habitIds) => {
            "use server";
            await updateUserHabits(user.id, habitIds);
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading habits page:", error);
    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        <Card className="p-6 bg-black/40">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Error Loading Habits</h2>
            <p className="text-muted-foreground">
              There was an error loading the habits configuration. Please try
              again later.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600"
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}
