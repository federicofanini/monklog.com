import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCurrentMentorPersona,
  getMentorMessages,
} from "@/packages/database/user/mentor";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { selectMentor } from "./actions";
import { RetryButton } from "@/components/ui/retry-button";
import { MentorChat } from "@/components/private/users/MentorChat";
import type { MentorPersona } from "@prisma/client";

interface MentorInfo {
  id: MentorPersona;
  name: string;
  welcomeMessage: string;
}

const mentorPersonas = [
  {
    id: "GHOST" as MentorPersona,
    name: "The Ghost",
    tagline: "Train. Or stay soft.",
    description: "1-line, ruthless, no fluff. Pure military discipline.",
    style: "from-neutral-900 to-neutral-950",
    welcomeMessage: "Speak your truth. Or remain weak.",
  },
  {
    id: "WARRIOR" as MentorPersona,
    name: "The Marine",
    tagline: "Every day is a battle. Win it.",
    description:
      "Aggressive motivation, focused on mental toughness and daily victories.",
    style: "from-red-950 to-black",
    welcomeMessage: "Report your status, soldier. No excuses accepted.",
  },
  {
    id: "MONK" as MentorPersona,
    name: "The Monk",
    tagline: "Silence. Discipline. Mastery.",
    description: "Stoic wisdom, focused on inner strength and mental clarity.",
    style: "from-blue-950 to-black",
    welcomeMessage: "The mind must be mastered before the body can follow.",
  },
  {
    id: "SHADOW" as MentorPersona,
    name: "The CEO",
    tagline: "Embrace the darkness within.",
    description: "Dark motivation, focused on transformation through pain.",
    style: "from-purple-950 to-black",
    welcomeMessage:
      "Let's assess your performance metrics and optimize your execution.",
  },
] as const;

export default async function MentorPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  try {
    const [currentPersona, messages] = await Promise.all([
      getCurrentMentorPersona(user.id),
      getMentorMessages(user.id, 50),
    ]);

    const currentMentor = mentorPersonas.find((m) => m.id === currentPersona);

    if (!currentMentor) {
      return (
        <div className="grid h-screen place-items-center bg-black p-4">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold font-mono text-red-500">
                CHOOSE YOUR MENTOR
              </h2>
              <p className="text-sm text-white/60 max-w-lg mx-auto">
                Select a mentor to begin your journey. Each mentor has a unique
                approach to building mental toughness.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {mentorPersonas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={async () => {
                    "use server";
                    await selectMentor(user.id, persona.id);
                  }}
                  className={`p-4 text-left rounded-lg bg-gradient-to-b ${persona.style} hover:ring-1 hover:ring-red-500/50 group transition-all`}
                >
                  <div className="space-y-2">
                    <div className="font-mono text-lg font-bold group-hover:text-red-500 transition-colors">
                      {persona.name}
                    </div>
                    <div className="text-sm text-white/80">
                      {persona.tagline}
                    </div>
                    <div className="text-xs text-white/40">
                      {persona.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-gradient-to-b from-black to-neutral-950">
        {/* Header */}
        <Select
          defaultValue={currentPersona}
          onValueChange={async (value) => {
            "use server";
            await selectMentor(user.id, value as MentorPersona);
          }}
        >
          <SelectTrigger className="w-[180px] h-8 bg-black/40 border-red-500/20 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mentorPersonas.map((persona) => (
              <SelectItem
                key={persona.id}
                value={persona.id}
                className="bg-gradient-to-b from-black to-neutral-950 focus:bg-red-500/10 focus:text-red-500"
              >
                <div className="flex flex-col py-1">
                  <span className="font-mono text-sm">{persona.name}</span>
                  <span className="text-xs text-white/40">
                    {persona.tagline}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chat Area */}
        <MentorChat
          userId={user.id}
          currentMentor={
            {
              id: currentMentor.id,
              name: currentMentor.name,
              welcomeMessage: currentMentor.welcomeMessage,
            } as MentorInfo
          }
          initialMessages={messages}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading mentor page:", error);
    return (
      <div className="grid h-screen place-items-center bg-black p-4">
        <div className="text-center space-y-4">
          <div className="font-mono text-lg text-red-500">ERROR</div>
          <p className="text-sm text-white/60">
            Failed to load mentor page. Please try again.
          </p>
          <RetryButton />
        </div>
      </div>
    );
  }
}
