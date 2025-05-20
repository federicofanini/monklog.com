import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserHabits } from "@/packages/database/user/habits";
import { HabitConfig } from "@/components/private/users/habit-config";
import { HabitTimeline } from "@/components/private/users/habit-timeline";
import { HabitGeneratorWrapper } from "@/components/private/users/habit-generator-wrapper";
import { updateUserHabits, deleteHabits } from "./actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function HabitsPage() {
  try {
    const habits = await getUserHabits();

    async function handleDelete() {
      "use server";
      await deleteHabits();
    }

    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Configure Habits</h1>
          <p className="text-muted-foreground">
            Select the habits you want to track daily. These will appear in your
            daily log and contribute to your mental toughness score.
          </p>
        </div>

        {habits.length === 0 ? (
          <HabitGeneratorWrapper />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <Tabs defaultValue="timeline" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline">
                  <HabitTimeline habits={habits} />
                </TabsContent>

                <TabsContent value="list">
                  <HabitConfig
                    habits={habits}
                    onSave={async (habitIds) => {
                      "use server";
                      await updateUserHabits(habitIds);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="pt-4">
              <Card className="p-6 bg-black/40">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-mono text-red-500">NEED A RESET?</h3>
                    <form action={handleDelete}>
                      <Button
                        type="submit"
                        variant="destructive"
                        className="bg-red-900 hover:bg-red-800 text-sm"
                      >
                        Delete All Habits
                      </Button>
                    </form>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Let the AI mentor design a new strategic habit system based
                    on your current goals and constraints.
                  </p>
                  <HabitGeneratorWrapper />
                </div>
              </Card>
            </div>
          </>
        )}
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
