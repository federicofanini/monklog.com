"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatUserMenu() {
  const { user, isLoading } = useKindeBrowserClient();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8 cursor-pointer border border-red-500/40 bg-black/80 rounded-xl">
          {user.picture && (
            <AvatarImage
              src={user.picture}
              alt={user.given_name || ""}
              width={32}
              height={32}
            />
          )}
          <AvatarFallback className="bg-black/80 rounded-xl">
            <span className="text-xs font-mono text-red-500">
              {(user.given_name || "")?.charAt(0)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[240px] border-red-500/20 bg-black/80 backdrop-blur-md"
        sideOffset={10}
        align="end"
      >
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="truncate line-clamp-1 max-w-[155px] block font-mono text-red-500">
                {`${user.given_name || ""} ${user.family_name || ""}`.trim()}
              </span>
              <span className="truncate text-xs text-muted-foreground font-mono">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-red-500/20" />

        <DropdownMenuGroup>
          <Link prefetch href="/blackboard/settings">
            <DropdownMenuItem className="font-mono text-muted-foreground hover:text-green-400 hover:bg-red-500/10">
              Account
            </DropdownMenuItem>
          </Link>

          <Link prefetch href="/blackboard/settings">
            <DropdownMenuItem className="font-mono text-muted-foreground hover:text-green-400 hover:bg-red-500/10">
              Support
            </DropdownMenuItem>
          </Link>

          <Link prefetch href="/blackboard/tokens">
            <DropdownMenuItem className="font-mono text-muted-foreground hover:text-green-400 hover:bg-red-500/10">
              Credits
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-red-500/20" />

        <DropdownMenuItem className="font-mono text-red-500 hover:text-red-400 hover:bg-red-500/10">
          <Link href="/api/auth/logout" className="flex items-center gap-2">
            <LogOut className="h-4 w-4 text-red-500" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
