import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX, ArrowRight, Shield, Users, ChartLine } from "lucide-react";
import { paths } from "@/lib/path";

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen py-18">
      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-black/40 border-red-500/20">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-red-500/30 rounded-full blur-lg" />
                <div className="relative p-4 bg-red-500/10 rounded-full">
                  <UserX className="h-16 w-16 text-red-500" />
                </div>
              </div>
            </div>
            <CardTitle className="font-mono text-2xl text-center text-white/90 mb-2">
              Profile Not Found
            </CardTitle>
            <p className="font-mono text-sm text-center text-white/60">
              This profile does not exist... yet. Why not make it yours?
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/20 rounded-lg border border-red-500/10">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Shield className="h-4 w-4 text-red-500" />
                  </div>
                  <h3 className="font-mono text-sm text-white/90">
                    Secure Profile
                  </h3>
                </div>
                <p className="font-mono text-xs text-white/60">
                  Create your secure profile and control what others can see
                </p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-red-500/10">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Users className="h-4 w-4 text-red-500" />
                  </div>
                  <h3 className="font-mono text-sm text-white/90">
                    Join Community
                  </h3>
                </div>
                <p className="font-mono text-xs text-white/60">
                  Connect with others and share your journey
                </p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-red-500/10">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <ChartLine className="h-4 w-4 text-red-500" />
                  </div>
                  <h3 className="font-mono text-sm text-white/90">
                    Track Progress
                  </h3>
                </div>
                <p className="font-mono text-xs text-white/60">
                  Monitor your growth and celebrate achievements
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-sm p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <div className="text-center space-y-2 mb-4">
                  <p className="font-mono text-sm text-red-500">
                    Claim your unique profile
                  </p>
                  <p className="font-mono text-xs text-white/60">
                    Start your journey today and make this username yours
                  </p>
                </div>
                <div className="flex justify-center space-x-3">
                  <Link href={paths.api.login}>
                    <Button
                      variant="destructive"
                      className="font-mono text-xs bg-red-500/80 hover:bg-red-500 flex items-center space-x-2"
                    >
                      <span>Create Profile</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="font-mono text-xs bg-red-500/10 hover:bg-red-500/20 border-0"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
