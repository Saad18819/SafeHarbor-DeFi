export const TREASURY_PROFILE_KEY = "treasury_profile";

export type TreasuryOnboarding = {
  currency: string;
  riskTolerance: string;
  monthlyBurn: string;
  custodyProvider: string;
  completedAt?: number;
};

export type TreasuryProfile = {
  fullName: string;
  email: string;
  walletAddress?: string;
  onboarding?: TreasuryOnboarding;
};

export function getTreasuryProfile(): TreasuryProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TREASURY_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TreasuryProfile;
  } catch {
    return null;
  }
}

export function setTreasuryProfile(profile: TreasuryProfile): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TREASURY_PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("treasury-profile-change"));
}

export function mergeTreasuryProfile(
  partial: Partial<TreasuryProfile>
): TreasuryProfile | null {
  const prev = getTreasuryProfile();
  let fullName = partial.fullName ?? prev?.fullName ?? "";
  let email = partial.email ?? prev?.email ?? "";
  const walletAddress = partial.walletAddress ?? prev?.walletAddress;
  const onboarding = partial.onboarding ?? prev?.onboarding;

  if (walletAddress && !fullName) {
    fullName = "Wallet user";
    email = email || "wallet@connected.local";
  }

  const next: TreasuryProfile = {
    fullName,
    email,
    walletAddress,
    onboarding,
  };
  if (!next.fullName && !next.email && !next.walletAddress) return prev;
  setTreasuryProfile(next);
  return next;
}

export function clearTreasuryProfile(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TREASURY_PROFILE_KEY);
  sessionStorage.removeItem("treasury_onboarding");
  window.dispatchEvent(new Event("treasury-profile-change"));
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
