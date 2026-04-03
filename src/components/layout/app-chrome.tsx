import { AppHeader } from "@/components/layout/app-header";

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
