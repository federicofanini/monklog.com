import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getCurrentMentorPersona,
  getMentorMessages,
} from "@/packages/database/user/mentor";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { selectMentor } from "./actions";
import Link from "next/link";
import { RetryButton } from "@/components/ui/retry-button";

const mentorPersonas = [
  {
    id: "GHOST",
    name: "The Ghost",
    tagline: "Train. Or stay soft.",
    description: "1-line, ruthless, no fluff. Pure military discipline.",
    style: "bg-gradient-to-br from-gray-900 to-gray-800",
  },
  {
    id: "WARRIOR",
    name: "The Warrior",
    tagline: "Every day is a battle. Win it.",
    description:
      "Aggressive motivation, focused on mental toughness and daily victories.",
    style: "bg-gradient-to-br from-red-900 to-red-800",
  },
  {
    id: "MONK",
    name: "The Monk",
    tagline: "Silence. Discipline. Mastery.",
    description: "Stoic wisdom, focused on inner strength and mental clarity.",
    style: "bg-gradient-to-br from-blue-900 to-blue-800",
  },
  {
    id: "SHADOW",
    name: "The Shadow",
    tagline: "Embrace the darkness within.",
    description: "Dark motivation, focused on transformation through pain.",
    style: "bg-gradient-to-br from-purple-900 to-purple-800",
  },
] as const;

export default async function MentorPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  try {
    // Get current mentor and latest message
    const [currentPersona, latestMessages] = await Promise.all([
      getCurrentMentorPersona(user.id),
      getMentorMessages(user.id, 1),
    ]);

    const currentMentor = mentorPersonas.find((m) => m.id === currentPersona);
    const latestMessage = latestMessages[0];

    return (
      <div className="container max-w-4xl py-8 space-y-8 mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Choose Your Mentor</h1>
          <p className="text-muted-foreground">
            Select the mentor persona that will guide your transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mentorPersonas.map((persona) => (
            <Card
              key={persona.id}
              className={`p-6 space-y-4 cursor-pointer hover:ring-2 hover:ring-red-500 transition-all ${
                persona.id === currentPersona ? "ring-2 ring-red-500" : ""
              } ${persona.style}`}
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-mono">{persona.name}</h3>
                <div className="h-px bg-red-500/20" />
              </div>

              <blockquote className="text-lg italic">
                &quot;{persona.tagline}&quot;
              </blockquote>

              <p className="text-sm text-muted-foreground">
                {persona.description}
              </p>

              <div className="pt-2">
                <form
                  action={async () => {
                    "use server";
                    await selectMentor(user.id, persona.id);
                  }}
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full hover:bg-red-500 hover:text-white"
                    disabled={persona.id === currentPersona}
                  >
                    {persona.id === currentPersona
                      ? "Current Mentor"
                      : `Select ${persona.name}`}
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>

        {currentMentor ? (
          latestMessage ? (
            <Card className="p-6 bg-black/40">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-red-500">
                    CURRENT MENTOR: {currentMentor.name.toUpperCase()}
                  </span>
                  <div className="flex-1 h-px bg-red-500/20" />
                </div>

                <div className="space-y-4">
                  <blockquote className="font-mono text-lg">
                    {latestMessage.message}
                  </blockquote>

                  {latestMessage.challenge && (
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1">
                        Request Guidance
                      </Button>
                      <Button className="flex-1 bg-red-500 hover:bg-red-600">
                        Accept Challenge
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-black/40">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold">No Messages Yet</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Start your training by logging your first day. Your mentor
                  will provide guidance and challenges based on your progress.
                </p>
                <Link href={paths.monk.log}>
                  <Button className="bg-red-500 hover:bg-red-600">
                    Start Training
                  </Button>
                </Link>
              </div>
            </Card>
          )
        ) : (
          <Card className="p-6 bg-black/40">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">Choose Your Path</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Select a mentor above to begin your journey. Each mentor has a
                unique approach to building mental toughness.
              </p>
            </div>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading mentor page:", error);
    return (
      <div className="container max-w-4xl py-8 space-y-8 mx-auto">
        <Card className="p-6 bg-black/40">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Error Loading Page</h2>
            <p className="text-muted-foreground">
              There was an error loading the mentor page. Please try again
              later.
            </p>
            <RetryButton />
          </div>
        </Card>
      </div>
    );
  }
}
