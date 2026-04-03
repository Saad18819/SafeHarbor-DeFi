"use client";

import { Landmark, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSimulationStore } from "@/stores/simulation-store";
import { useTreasuryStore } from "@/stores/treasury-store";
import { cn } from "@/lib/utils";

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PortfolioOverview({ className }: { className?: string }) {
  const { totalUsd, split, lastRebalanceAt } = useTreasuryStore();
  const monthlyBurnUsd = useSimulationStore((s) => s.monthlyBurnUsd);
  const fiatPct =
    totalUsd > 0 ? Math.round((split.fiatStablecoinsUsd / totalUsd) * 100) : 0;
  const defiPct = 100 - fiatPct;

  const runwayMonths =
    monthlyBurnUsd > 0 ? totalUsd / monthlyBurnUsd : null;

  return (
    <Card
      className={cn(
        "border-border bg-card shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          Treasury balance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Stables vs. deployed yield
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total
          </p>
          <p className="mt-1 font-mono text-4xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatUsd(totalUsd)}
          </p>
          {lastRebalanceAt ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Last rebalance (sim):{" "}
              {new Date(lastRebalanceAt).toLocaleString()}
            </p>
          ) : null}
          <div className="mt-4 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Runway (sim)
            </p>
            <p className="mt-0.5 font-mono text-lg tabular-nums text-foreground">
              {runwayMonths != null && Number.isFinite(runwayMonths)
                ? `${runwayMonths >= 100 ? Math.round(runwayMonths) : runwayMonths.toFixed(1)} mo`
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              Balance ÷ monthly burn ({formatUsd(monthlyBurnUsd)}/mo from dev
              settings)
            </p>
          </div>
        </div>

        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-muted-foreground/30 transition-all duration-500"
            style={{ width: `${fiatPct}%` }}
            title="Stables"
          />
          <div
            className="bg-primary transition-all duration-500"
            style={{ width: `${defiPct}%` }}
            title="On-chain yield"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Landmark className="h-4 w-4 text-foreground/70" />
              Stables
            </div>
            <p className="mt-2 font-mono text-2xl tabular-nums text-foreground">
              {formatUsd(split.fiatStablecoinsUsd)}
            </p>
            <p className="text-xs text-muted-foreground">USDC / USDT / PYUSD</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Yield
            </div>
            <p className="mt-2 font-mono text-2xl tabular-nums text-primary">
              {formatUsd(split.defiYieldUsd)}
            </p>
            <p className="text-xs text-muted-foreground">Aave, Compound, vaults</p>
          </div>
        </div>

        <Separator />
        <p className="text-xs text-muted-foreground">
          Split:{" "}
          <span className="font-medium text-foreground">{fiatPct}%</span>{" "}
          stables ·{" "}
          <span className="font-medium text-primary">{defiPct}%</span> yield
        </p>
      </CardContent>
    </Card>
  );
}
