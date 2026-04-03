"use client";

import { Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { VibeShiftResult } from "@/lib/vibe-shift-engine";

const copy: Record<
  VibeShiftResult["health"],
  { label: string; hint: string; bar: number }
> = {
  healthy: {
    label: "Healthy",
    hint: "No active treasury stress signals.",
    bar: 92,
  },
  warning: {
    label: "Warning",
    hint: "Yield or liquidity drift — review allocation.",
    bar: 58,
  },
  critical: {
    label: "Critical",
    hint: "Peg stress or severe yield shortfall — pause automation and triage.",
    bar: 22,
  },
};

export function TreasuryHealthGauge({
  health,
  className,
}: {
  health: VibeShiftResult["health"];
  className?: string;
}) {
  const meta = copy[health];
  const Icon =
    health === "healthy"
      ? ShieldCheck
      : health === "warning"
        ? Activity
        : AlertTriangle;

  return (
    <Card
      className={cn(
        "border-border bg-card shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground">
          Health
        </CardTitle>
        <Icon
          className={cn(
            "h-5 w-5",
            health === "healthy" && "text-emerald-600",
            health === "warning" && "text-amber-600",
            health === "critical" && "text-destructive"
          )}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              "text-2xl font-semibold tracking-tight",
              health === "healthy" && "text-emerald-600",
              health === "warning" && "text-amber-600",
              health === "critical" && "text-destructive"
            )}
          >
            {meta.label}
          </span>
          <span className="text-xs text-muted-foreground">Risk</span>
        </div>
        <Progress
          value={meta.bar}
          className={cn(
            "h-2 bg-muted",
            health === "healthy" && "[&>div]:bg-emerald-600",
            health === "warning" && "[&>div]:bg-amber-500",
            health === "critical" && "[&>div]:bg-destructive"
          )}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">{meta.hint}</p>
      </CardContent>
    </Card>
  );
}
