"use client";

import { Link2 } from "lucide-react";
import type { Address } from "viem";
import { useChainId } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PROTOCOL_ADDRESSES,
  formatApyPercent,
  type StableSupplyApy,
} from "@/lib/protocol-mock-provider";
import { encodeReserveDataCall } from "@/lib/wagmi-simulate";
import { cn } from "@/lib/utils";

const USDC_MAINNET =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address;

export function ProtocolIntegration({
  rates,
  className,
}: {
  rates: StableSupplyApy[];
  className?: string;
}) {
  const chainId = useChainId();

  return (
    <Card
      className={cn(
        "border-border bg-card shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
            Protocol rates
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aave V3 &amp; Compound V3 — simulated supply APY (USDC)
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-border font-mono text-xs text-muted-foreground"
        >
          chain {chainId}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {rates.map((row) => (
          <div
            key={row.protocol}
            className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{row.label}</span>
              </div>
              <Tooltip>
                <TooltipTrigger className="mt-1 block w-fit cursor-help text-left font-mono text-xs text-muted-foreground">
                  slot {row.mockSlot.slice(0, 10)}…
                </TooltipTrigger>
                <TooltipContent className="max-w-xs border-border bg-popover text-xs text-popover-foreground">
                  Mock storage fingerprint via{" "}
                  <code className="text-primary">keccak256(abi.encode)</code> — replace
                  with <code className="text-primary">readContract</code> live.
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Supply APY
              </p>
              <p className="font-mono text-2xl tabular-nums text-emerald-600">
                {formatApyPercent(row.supplyApyBps)}%
              </p>
            </div>
          </div>
        ))}

        <div className="rounded-md border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Reference</p>
          <p className="mt-1 break-all font-mono text-[11px]">
            Aave pool: {PROTOCOL_ADDRESSES.aaveV3Pool}
          </p>
          <p className="mt-1 break-all font-mono text-[11px]">
            Compound USDC: {PROTOCOL_ADDRESSES.compoundUSDC}
          </p>
          <p className="mt-2 font-medium text-foreground">Calldata (mock)</p>
          <p className="mt-1 break-all font-mono text-[10px]">
            {encodeReserveDataCall(USDC_MAINNET).slice(0, 42)}…
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
