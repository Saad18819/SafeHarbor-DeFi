"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  getTreasuryProfile,
  clearTreasuryProfile,
  initialsFromName,
  type TreasuryProfile,
} from "@/lib/treasury-session";
import { cn } from "@/lib/utils";

function readProfile(): TreasuryProfile | null {
  return getTreasuryProfile();
}

export function AppHeader() {
  const router = useRouter();
  const [profile, setProfile] = useState<TreasuryProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const sync = useCallback(() => {
    setProfile(readProfile());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("treasury-profile-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("treasury-profile-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const signOut = () => {
    clearTreasuryProfile();
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  const displayName = profile?.fullName?.trim() || "Member";
  const initials = initialsFromName(displayName);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground hover:text-primary"
        >
          DeFi Treasury Manager
        </Link>

        <div className="flex items-center gap-2">
          {profile?.fullName || profile?.email ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-border bg-card py-1.5 pl-2 pr-2 shadow-sm transition-colors",
                  "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block max-w-[160px] truncate text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                  {profile.email ? (
                    <span className="block max-w-[160px] truncate text-xs text-muted-foreground">
                      {profile.email}
                    </span>
                  ) : null}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              {menuOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default bg-transparent"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-1 w-52 rounded-lg border border-border bg-card py-1 shadow-lg">
                    <div className="border-b border-border px-3 py-2 sm:hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {displayName}
                      </p>
                      {profile.email ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {profile.email}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Account settings
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ size: "sm" })}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
