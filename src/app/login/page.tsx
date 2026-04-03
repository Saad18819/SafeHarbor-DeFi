import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Sign in · DeFi Treasury Manager",
};

export default function LoginPage() {
  return <LoginClient />;
}
