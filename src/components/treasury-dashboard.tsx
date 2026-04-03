"use client";

import { useMemo } from "react";
import { DevSimulationPanel } from "@/components/dev-simulation-panel";
import { PortfolioOverview } from "@/components/portfolio-overview";
import { ProtocolIntegration } from "@/components/protocol-integration";
import { TreasuryHealthGauge } from "@/components/treasury-health-gauge";
import { VibeShiftAlert } from "@/components/vibe-shift-alert";
import {
  simulationApyToRates,
  simulationPricesToFeed,
} from "@/lib/simulation-adapters";
import { runVibeShiftMonitor } from "@/lib/monitoring-service";
import { useSimulationStore } from "@/stores/simulation-store";

export function TreasuryDashboard() {
  const priceUSDC = useSimulationStore((s) => s.priceUSDC);
  const priceUSDT = useSimulationStore((s) => s.priceUSDT);
  const pricePYUSD = useSimulationStore((s) => s.pricePYUSD);
  const aaveApyPercent = useSimulationStore((s) => s.aaveApyPercent);
  const compoundApyPercent = useSimulationStore((s) => s.compoundApyPercent);

  const rates = useMemo(
    () => simulationApyToRates(aaveApyPercent, compoundApyPercent),
    [aaveApyPercent, compoundApyPercent]
  );

  const prices = useMemo(
    () =>
      simulationPricesToFeed({
        usdc: priceUSDC,
        usdt: priceUSDT,
        pyusd: pricePYUSD,
      }),
    [priceUSDC, priceUSDT, pricePYUSD]
  );

  const vibe = useMemo(
    () => runVibeShiftMonitor(rates, prices),
    [rates, prices]
  );

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-40 pt-10 sm:px-6 sm:pb-44 lg:px-8">
        <header className="space-y-2 border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            DeFi Treasury Manager
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Overview
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Stables vs. deployed yield, protocol rates, and alerts when floors or
            pegs break. Use dev settings to simulate markets live.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <PortfolioOverview />
            <ProtocolIntegration rates={rates} />
          </div>
          <div className="space-y-6">
            <TreasuryHealthGauge
              health={vibe.health}
              className="min-h-[200px]"
            />
          </div>
        </div>

        <VibeShiftAlert vibe={vibe} />
      </div>
      <DevSimulationPanel />
    </>
  );
}
