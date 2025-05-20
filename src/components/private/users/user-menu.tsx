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

export function UserMenu() {
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
        <Avatar className="rounded-lg w-8 h-8 cursor-pointer">
          {user.picture && (
            <AvatarImage
              src={user.picture}
              alt={user.given_name || ""}
              width={32}
              height={32}
            />
          )}
          <AvatarFallback>
            <span className="text-xs text-primary">
              {(user.given_name || "")?.charAt(0)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="truncate line-clamp-1 max-w-[155px] block">
                {`${user.given_name || ""} ${user.family_name || ""}`.trim()}
              </span>
              <span className="truncate text-xs text-[#606060] font-normal">
                {user.email}
              </span>
            </div>
            <div className="border py-0.5 px-3 rounded-full text-[11px] font-normal">
              Beta
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link prefetch href="/blackboard/settings">
            <DropdownMenuItem>Account</DropdownMenuItem>
          </Link>

          <Link prefetch href="/blackboard/settings">
            <DropdownMenuItem>Support</DropdownMenuItem>
          </Link>

          <Link prefetch href="/blackboard/tokens">
            <DropdownMenuItem>Credits</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500 font-bold">
          <Link href="/api/auth/logout">
            <LogOut />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
