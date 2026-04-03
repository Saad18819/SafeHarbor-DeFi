"use client";

import { Bell, LineChart, Zap } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VibeShiftResult } from "@/lib/vibe-shift-engine";
import { useTreasuryStore } from "@/stores/treasury-store";

type Props = {
  vibe: VibeShiftResult;
};

export function VibeShiftAlert({ vibe }: Props) {
  const [executing, setExecuting] = useState(false);
  const executeRebalance = useTreasuryStore((s) => s.executeRebalanceSimulation);

  const onExecute = async () => {
    setExecuting(true);
    await new Promise((r) => setTimeout(r, 900));
    executeRebalance(500_000);
    setExecuting(false);
  };

  return (
    <Card className="border border-alert-amber-border bg-alert-amber shadow-card">
      <CardHeader className="space-y-1 border-b border-alert-amber-border/80 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-amber-200/80 bg-white/60 font-normal text-alert-amber-foreground"
          >
            <LineChart className="mr-1 h-3 w-3 opacity-80" />
            Risk monitor
          </Badge>
          <span className="text-xs text-muted-foreground">
            Yield floor &amp; peg checks
          </span>
        </div>
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <Bell className="h-6 w-6 text-amber-700" />
          Vibe shift
        </CardTitle>
        <CardDescription>
          Live view of simulated Aave / Compound APYs and manual stable prices
          from dev settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-white/40 pt-6">
        {vibe.triggers.length === 0 ? (
          <Alert className="border border-emerald-200 bg-emerald-50/90 text-emerald-950">
            <Zap className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-900">All clear</AlertTitle>
            <AlertDescription className="text-emerald-800/90">
              No floor breach or peg stress on tracked stables.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert
            className={
              vibe.health === "critical"
                ? "border border-red-200 bg-red-50 text-red-950"
                : "border border-amber-200 bg-amber-50/90 text-amber-950"
            }
          >
            <Bell className="h-4 w-4" />
            <AlertTitle>Alert</AlertTitle>
            <AlertDescription className="space-y-3 text-sm leading-relaxed">
              <ul className="list-inside list-disc text-foreground/90">
                {vibe.triggers.map((t, i) => (
                  <li key={i}>
                    {t.kind === "yield_drop"
                      ? `${t.protocol}: supply APY ${(t.apyBps / 100).toFixed(2)}% < ${(t.thresholdBps / 100).toFixed(2)}% floor`
                      : `${t.symbol} @ $${t.priceUsd.toFixed(4)} < $${t.thresholdUsd}`}
                  </li>
                ))}
              </ul>
              {vibe.suggestedAction ? (
                <p className="rounded-md border border-border bg-card p-3 font-medium text-foreground shadow-sm">
                  {vibe.suggestedAction}
                </p>
              ) : null}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="lg"
            disabled={executing}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onExecute}
          >
            {executing ? "Signing…" : "Execute Rebalance"}
          </Button>
          <p className="max-w-md text-xs text-muted-foreground">
            Simulated swap + deposit only. Moves $500k from stables into the
            yield sleeve.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
