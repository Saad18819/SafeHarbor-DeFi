"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  mergeTreasuryProfile,
  setTreasuryProfile,
} from "@/lib/treasury-session";

const loginSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const onboardingSchema = z.object({
  currency: z.enum(["USD", "EUR", "USDC"]),
  riskTolerance: z.enum(["conservative", "balanced", "degen"]),
  monthlyBurn: z.string().min(1, "Enter an estimate"),
  custodyProvider: z.string().min(1, "Enter a provider"),
});

type LoginValues = z.infer<typeof loginSchema>;
type OnboardingValues = z.infer<typeof onboardingSchema>;

const ONBOARDING_STEPS: {
  title: string;
  description: string;
  field: keyof OnboardingValues;
}[] = [
  {
    title: "Operating currency",
    description: "What is your startup's primary operating currency?",
    field: "currency",
  },
  {
    title: "Risk tolerance",
    description: "How should we size protocol and yield exposure?",
    field: "riskTolerance",
  },
  {
    title: "Monthly burn",
    description: "Estimated monthly burn (for runway alerts).",
    field: "monthlyBurn",
  },
  {
    title: "Custody & banking",
    description: "Primary banking or custody provider.",
    field: "custodyProvider",
  },
];

export function LoginClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<"signin" | "onboarding">("signin");
  const [step, setStep] = useState(0);
  const [demoWallet, setDemoWallet] = useState<string | null>(null);
  const [walletBusy, setWalletBusy] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onboardingForm = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      currency: "USD",
      riskTolerance: "balanced",
      monthlyBurn: "",
      custodyProvider: "",
    },
  });

  const onLogin = (data: LoginValues) => {
    setTreasuryProfile({
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
    });
    setPhase("onboarding");
    setStep(0);
  };

  const goNext = async () => {
    const field = ONBOARDING_STEPS[step].field;
    const ok = await onboardingForm.trigger(field);
    if (!ok) return;
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const values = onboardingForm.getValues();
      mergeTreasuryProfile({
        onboarding: {
          currency: values.currency,
          riskTolerance: values.riskTolerance,
          monthlyBurn: values.monthlyBurn,
          custodyProvider: values.custodyProvider,
          completedAt: Date.now(),
        },
      });
      try {
        sessionStorage.setItem(
          "treasury_onboarding",
          JSON.stringify({ ...values, completedAt: Date.now() })
        );
      } catch {
        /* ignore */
      }
      router.push("/");
      router.refresh();
    }
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else setPhase("signin");
  };

  const meta = ONBOARDING_STEPS[step];
  const fieldName = meta.field;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Treasury
        </Link>
      </div>

      {phase === "signin" ? (
        <Card className="w-full max-w-md border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Sign in
            </CardTitle>
            <CardDescription>
              Use your work email or connect a wallet to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="name"
                          placeholder="Alex Chen"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-border"
                disabled={walletBusy}
                onClick={async () => {
                  setWalletBusy(true);
                  await new Promise((r) => setTimeout(r, 600));
                  const addr =
                    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" as const;
                  setDemoWallet(addr);
                  mergeTreasuryProfile({ walletAddress: addr });
                  setWalletBusy(false);
                }}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {walletBusy ? "Opening wallet…" : "Connect wallet"}
              </Button>
              {demoWallet ? (
                <p className="text-center font-mono text-xs text-muted-foreground">
                  Connected {demoWallet.slice(0, 6)}…{demoWallet.slice(-4)}
                </p>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setTreasuryProfile({
                    fullName: "Demo founder",
                    email: "demo@treasury.app",
                  });
                  setPhase("onboarding");
                  setStep(0);
                }}
              >
                Skip to onboarding (demo)
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-lg border-border shadow-card">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">
              Step {step + 1} of {ONBOARDING_STEPS.length}
            </p>
            <CardTitle className="text-xl text-foreground">
              {meta.title}
            </CardTitle>
            <CardDescription>{meta.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...onboardingForm}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-6"
              >
                {fieldName === "currency" && (
                  <FormField
                    control={onboardingForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-foreground">
                          Currency
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid gap-3"
                          >
                            {(["USD", "EUR", "USDC"] as const).map((c) => (
                              <div
                                key={c}
                                className={cn(
                                  "flex items-center space-x-3 rounded-lg border border-border px-4 py-3",
                                  field.value === c && "border-primary bg-accent/50"
                                )}
                              >
                                <RadioGroupItem value={c} id={`ccy-${c}`} />
                                <Label
                                  htmlFor={`ccy-${c}`}
                                  className="flex-1 cursor-pointer font-normal text-foreground"
                                >
                                  {c}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {fieldName === "riskTolerance" && (
                  <FormField
                    control={onboardingForm.control}
                    name="riskTolerance"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-foreground">
                          Risk tolerance
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid gap-3"
                          >
                            {(
                              [
                                {
                                  v: "conservative" as const,
                                  label: "Conservative",
                                  hint: "Capital preservation first",
                                },
                                {
                                  v: "balanced" as const,
                                  label: "Balanced",
                                  hint: "Yield within guardrails",
                                },
                                {
                                  v: "degen" as const,
                                  label: "Degen / aggressive",
                                  hint: "Maximize deployed yield",
                                },
                              ] as const
                            ).map(({ v, label, hint }) => (
                              <div
                                key={v}
                                className={cn(
                                  "flex items-start space-x-3 rounded-lg border border-border px-4 py-3",
                                  field.value === v && "border-primary bg-accent/50"
                                )}
                              >
                                <RadioGroupItem value={v} id={`risk-${v}`} className="mt-1" />
                                <Label
                                  htmlFor={`risk-${v}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-medium text-foreground">
                                    {label}
                                  </span>
                                  <span className="block text-sm text-muted-foreground">
                                    {hint}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {fieldName === "monthlyBurn" && (
                  <FormField
                    control={onboardingForm.control}
                    name="monthlyBurn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Monthly burn (USD)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 85000"
                            inputMode="decimal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {fieldName === "custodyProvider" && (
                  <FormField
                    control={onboardingForm.control}
                    name="custodyProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Primary provider
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mercury, Coinbase, Safe, …"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between gap-3 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" onClick={goBack}>
              {step === 0 ? "Back to sign in" : "Back"}
            </Button>
            <Button type="button" onClick={goNext}>
              {step === ONBOARDING_STEPS.length - 1 ? "Finish" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
