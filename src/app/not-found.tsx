import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen py-18">
      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-black/40 border-red-500/20">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <UserX className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="font-mono text-xl text-center text-white/90">
              Profile Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm text-center text-white/60 mb-6">
              This profile does not exist or is not public.
            </p>
            <div className="flex justify-center">
              <Link href="/">
                <Button
                  variant="outline"
                  className="font-mono text-xs bg-red-500/20 hover:bg-red-500/30 border-0"
                >
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
