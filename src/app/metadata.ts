import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "Monk Mode",
    "Habit Tracker",
    "Discipline App",
    "AI Mentor",
    "Focus Tracker",
    "Founder Productivity",
    "Daily Streaks",
    "Self-Mastery",
  ],
  authors: [
    {
      name: "Federico Fanini",
      url: "https://federicofan.com",
    },
  ],
  creator: "federicofan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "@opengraph-image.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@FedericoFan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
