import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mentorPersonas = [
  {
    id: "ghost",
    name: "The Ghost",
    tagline: "Train. Or stay soft.",
    description: "1-line, ruthless, no fluff. Pure military discipline.",
    style: "bg-gradient-to-br from-gray-900 to-gray-800",
  },
  {
    id: "warrior",
    name: "The Warrior",
    tagline: "Every day is a battle. Win it.",
    description:
      "Aggressive motivation, focused on mental toughness and daily victories.",
    style: "bg-gradient-to-br from-red-900 to-red-800",
  },
  {
    id: "monk",
    name: "The Monk",
    tagline: "Silence. Discipline. Mastery.",
    description: "Stoic wisdom, focused on inner strength and mental clarity.",
    style: "bg-gradient-to-br from-blue-900 to-blue-800",
  },
  {
    id: "shadow",
    name: "The Shadow",
    tagline: "Embrace the darkness within.",
    description: "Dark motivation, focused on transformation through pain.",
    style: "bg-gradient-to-br from-purple-900 to-purple-800",
  },
];

export default function MentorPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
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
            className={`p-6 space-y-4 cursor-pointer hover:ring-2 hover:ring-red-500 transition-all ${persona.style}`}
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
              <Button
                variant="outline"
                className="w-full hover:bg-red-500 hover:text-white"
              >
                Select {persona.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-black/40">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-red-500">
              CURRENT MENTOR: THE GHOST
            </span>
            <div className="flex-1 h-px bg-red-500/20" />
          </div>

          <div className="space-y-4">
            <blockquote className="font-mono text-lg">
              Your last session showed promise. But promise means nothing
              without proof. Today is your chance to prove it wasn&apos;t a
              fluke.
            </blockquote>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                Request Guidance
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600">
                Accept Challenge
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
