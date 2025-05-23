import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProfile } from "@/packages/database/user/public-profile";
import { PublicProfilePage } from "@/components/public-page/public-profile-page";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicProfile } from "@/packages/database/user/public-profile";

// Define the type for the dynamic route params
type PageParams = { username: string } & Promise<string>;

// Define the type for the API response
type ProfileResponse = {
  data: {
    success: boolean;
    data: PublicProfile | null;
  };
};

// Generate static params for static optimization
export async function generateStaticParams() {
  return [];
}

async function getProfile(username: string): Promise<ProfileResponse> {
  try {
    const profile = await getPublicProfile(username);
    return {
      data: {
        success: !!profile,
        data: profile
          ? {
              username: profile.username,
              full_name: profile.full_name || profile.username,
              avatar_url: profile.avatar_url,
              joined_at: profile.joined_at,
              mental_toughness_score: profile.mental_toughness_score,
              level: profile.level,
              total_streaks: profile.total_streaks,
              current_streak: profile.current_streak,
              stats: profile.stats
                ? {
                    ...profile.stats,
                    total_days_logged: profile.stats.total_days_logged || 0,
                    completion_rate: profile.stats.completion_rate || 0,
                    health_trends: {
                      ...profile.stats.health_trends,
                      avg_daily_steps:
                        profile.stats.health_trends.avg_daily_steps || 0,
                      avg_daily_water:
                        profile.stats.health_trends.avg_daily_water || 0,
                      total_exercise_minutes:
                        profile.stats.health_trends.total_exercise_minutes || 0,
                    },
                    sleep_trends: {
                      ...profile.stats.sleep_trends,
                      avg_weekly_score:
                        profile.stats.sleep_trends.avg_weekly_score || 0,
                      avg_weekly_duration:
                        profile.stats.sleep_trends.avg_weekly_duration || 0,
                    },
                  }
                : null,
            }
          : null,
      },
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      data: {
        success: false,
        data: null,
      },
    };
  }
}

// Add dynamic flag to force dynamic rendering
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function PublicProfile({
  params,
}: {
  params: PageParams;
}) {
  const result = await getProfile(params.username);

  if (!result.data.success || !result.data.data) {
    return notFound();
  }

  const profileData = result.data.data;

  return (
    <Suspense
      fallback={
        <div className="bg-black py-18">
          <div className="max-w-4xl mx-auto p-4">
            <Card className="bg-black/40">
              <CardHeader>
                <CardTitle className="font-mono text-white/90">
                  Loading profile...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-red-500/20 rounded-lg" />
                  <div className="space-y-3">
                    <div className="h-4 bg-red-500/20 rounded w-3/4" />
                    <div className="h-4 bg-red-500/20 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <PublicProfilePage profile={profileData} username={params.username} />
    </Suspense>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const result = await getProfile(params.username);

    if (!result.data.success || !result.data.data) {
      return {
        title: "Profile Not Found | MonkLog",
        description: "This profile could not be found or is not public.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const profileData = result.data.data;
    const fullName = profileData.full_name;
    const stats = profileData.stats
      ? {
          steps: profileData.stats.health_trends.avg_daily_steps,
          sleep: profileData.stats.sleep_trends.avg_weekly_score,
          completion: Math.round(profileData.stats.completion_rate),
        }
      : null;

    const description = stats
      ? `${fullName}'s health journey - Averaging ${stats.steps.toLocaleString()} daily steps, ${
          stats.sleep
        }/100 sleep score, and ${stats.completion}% completion rate.`
      : `${fullName}'s health journey on MonkLog`;

    return {
      title: `${fullName} | MonkLog Profile`,
      description,
      openGraph: {
        title: `${fullName} | MonkLog Profile`,
        description,
        images: profileData.avatar_url ? [{ url: profileData.avatar_url }] : [],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${fullName} | MonkLog Profile`,
        description,
        images: profileData.avatar_url ? [profileData.avatar_url] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `/${params.username}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Profile Error | MonkLog",
      description: "There was an error loading this profile.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}
