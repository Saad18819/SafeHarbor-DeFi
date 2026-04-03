"use client";

import { ChevronUp, RotateCcw, Settings2 } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSimulationStore } from "@/stores/simulation-store";
import { cn } from "@/lib/utils";

function PriceRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const ticks = Math.round(value * 1000);
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <Label className="w-16 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Slider
        className="flex-1 py-2"
        min={900}
        max={1100}
        step={1}
        value={[ticks]}
        onValueChange={(v) => {
          const n = Array.isArray(v) ? v[0] : v;
          onChange(((typeof n === "number" ? n : 1000) ?? 1000) / 1000);
        }}
        aria-label={`${label} price`}
      />
      <span className="w-20 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
        ${value.toFixed(3)}
      </span>
    </div>
  );
}

export function DevSimulationPanel() {
  const [open, setOpen] = useState(false);
  const priceUSDC = useSimulationStore((s) => s.priceUSDC);
  const priceUSDT = useSimulationStore((s) => s.priceUSDT);
  const pricePYUSD = useSimulationStore((s) => s.pricePYUSD);
  const aaveApyPercent = useSimulationStore((s) => s.aaveApyPercent);
  const compoundApyPercent = useSimulationStore((s) => s.compoundApyPercent);
  const monthlyBurnUsd = useSimulationStore((s) => s.monthlyBurnUsd);
  const setPriceUSDC = useSimulationStore((s) => s.setPriceUSDC);
  const setPriceUSDT = useSimulationStore((s) => s.setPriceUSDT);
  const setPricePYUSD = useSimulationStore((s) => s.setPricePYUSD);
  const setAaveApyPercent = useSimulationStore((s) => s.setAaveApyPercent);
  const setCompoundApyPercent = useSimulationStore(
    (s) => s.setCompoundApyPercent
  );
  const setMonthlyBurnUsd = useSimulationStore((s) => s.setMonthlyBurnUsd);
  const reset = useSimulationStore((s) => s.reset);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto w-full max-w-4xl">
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="overflow-hidden rounded-xl border border-border bg-card/95 shadow-card backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Dev settings
              </span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Simulation
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground"
                onClick={reset}
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
              <CollapsibleTrigger
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 border-border"
                )}
              >
                <span className="mr-1">Controls</span>
                <ChevronUp
                  className={cn(
                    "h-4 w-4 transition-transform",
                    open && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="max-h-[min(70vh,520px)] overflow-y-auto border-t border-border px-4 py-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <section className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stablecoin prices ($0.90–$1.10)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Below $0.995 triggers de-peg alerts and critical health.
                </p>
                <div className="space-y-3">
                  <PriceRow
                    label="USDC"
                    value={priceUSDC}
                    onChange={setPriceUSDC}
                  />
                  <PriceRow
                    label="USDT"
                    value={priceUSDT}
                    onChange={setPriceUSDT}
                  />
                  <PriceRow
                    label="PYUSD"
                    value={pricePYUSD}
                    onChange={setPricePYUSD}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Supply APY (%)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Aave under 4% triggers yield warnings; under ~2.5% escalates
                  to critical.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="aave-apy" className="text-xs">
                      Aave V3
                    </Label>
                    <Input
                      id="aave-apy"
                      type="number"
                      step={0.01}
                      min={0}
                      max={25}
                      className="font-mono tabular-nums"
                      value={aaveApyPercent}
                      onChange={(e) =>
                        setAaveApyPercent(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compound-apy" className="text-xs">
                      Compound V3
                    </Label>
                    <Input
                      id="compound-apy"
                      type="number"
                      step={0.01}
                      min={0}
                      max={25}
                      className="font-mono tabular-nums"
                      value={compoundApyPercent}
                      onChange={(e) =>
                        setCompoundApyPercent(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="burn" className="text-xs">
                    Monthly burn (USD)
                  </Label>
                  <Input
                    id="burn"
                    type="number"
                    step={1000}
                    min={0}
                    className="max-w-xs font-mono tabular-nums"
                    value={monthlyBurnUsd}
                    onChange={(e) =>
                      setMonthlyBurnUsd(parseFloat(e.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Runway updates on the portfolio card from treasury balance ÷
                    burn.
                  </p>
                </div>
              </section>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
