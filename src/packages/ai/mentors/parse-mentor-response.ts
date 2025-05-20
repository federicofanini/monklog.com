import type { MentorType } from "@/components/private/chat/mentor-select";

export interface ParsedResponse {
  main: { title: string; content: string };
  challenge: { title: string; content: string };
}

const sectionTitles: Record<MentorType, [string, string]> = {
  GHOST: ["TRUTH", "CHALLENGE"],
  MONK: ["INSIGHT", "PATH"],
  WARRIOR: ["ASSESSMENT", "ORDERS"],
  CEO: ["ANALYSIS", "OBJECTIVE"],
};

export function parseMentorResponse(
  text: string,
  mentor: MentorType
): ParsedResponse {
  const [mainTitle, challengeTitle] = sectionTitles[mentor];

  // Split by section markers
  const parts = text.split(/\[([^\]]+)\]/);
  let mainContent = "";
  let challengeContent = "";
  const challengeMatch = text.match(/\*\*Challenge[^*]+\*\*/);

  // Process parts to find content
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].trim();
    let content = parts[i + 1]?.trim() || "";

    // If this section contains the challenge, split it out
    if (challengeMatch && content.includes(challengeMatch[0])) {
      content = content.replace(challengeMatch[0], "").trim();
    }

    if (title === mainTitle) {
      mainContent = content;
    } else if (title === challengeTitle) {
      challengeContent = content;
    }
  }

  // Add the challenge to the challenge section if found
  if (challengeMatch) {
    challengeContent = challengeContent + "\n\n" + challengeMatch[0];
  }

  return {
    main: {
      title: mainTitle,
      content: mainContent,
    },
    challenge: {
      title: challengeTitle,
      content: challengeContent,
    },
  };
}

// Helper function to test the parser
export function testParser(text: string, mentor: MentorType) {
  const result = parseMentorResponse(text, mentor);
  console.log("Parsed Result:", JSON.stringify(result, null, 2));
  return result;
}
