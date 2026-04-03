import type { StablecoinPrice } from "./price-feed";
import type { StableSupplyApy } from "./protocol-mock-provider";

export const YIELD_THRESHOLD_BPS = 400; // 4.00%
/** Below this Aave APY, health escalates to Critical (severe stress). */
export const YIELD_CRITICAL_BPS = 250; // 2.50%
export const DEPEG_THRESHOLD_USD = 0.995;

export type VibeTrigger =
  | { kind: "yield_drop"; protocol: string; apyBps: number; thresholdBps: number }
  | {
      kind: "depeg";
      symbol: string;
      priceUsd: number;
      thresholdUsd: number;
    };

export type VibeShiftResult = {
  triggers: VibeTrigger[];
  suggestedAction: string | null;
  health: "healthy" | "warning" | "critical";
};

function buildSuggestion(
  triggers: VibeTrigger[],
  rates: StableSupplyApy[]
): string | null {
  const yieldDrop = triggers.find((t) => t.kind === "yield_drop");
  const depeg = triggers.find((t) => t.kind === "depeg");
  const aave = rates.find((r) => r.protocol === "aave-v3");
  const morphoDelta = 2; // illustrative organic yield uplift %

  if (depeg && yieldDrop) {
    return `${depeg.symbol} is trading below peg while yield is stressed. Halt new deposits, withdraw at-risk inventory to cold fiat rails, and resize DeFi exposure after peg recovery.`;
  }
  if (depeg) {
    return `${depeg.symbol} is below $${DEPEG_THRESHOLD_USD.toFixed(3)}. Pause automated deployments and rotate exposure into the highest-liquidity stable until the peg stabilizes.`;
  }
  if (yieldDrop && aave) {
    return `Yield on Aave is tanking (${(aave.supplyApyBps / 100).toFixed(2)}% supply APY). Move 500k USDC to Morpho Blue for ~${morphoDelta}% higher organic yield on the same risk budget.`;
  }
  return null;
}

export function evaluateVibeShift(
  rates: StableSupplyApy[],
  prices: StablecoinPrice[]
): VibeShiftResult {
  const triggers: VibeTrigger[] = [];

  for (const r of rates) {
    if (r.protocol === "aave-v3" && r.supplyApyBps < YIELD_THRESHOLD_BPS) {
      triggers.push({
        kind: "yield_drop",
        protocol: r.label,
        apyBps: r.supplyApyBps,
        thresholdBps: YIELD_THRESHOLD_BPS,
      });
    }
  }

  for (const p of prices) {
    if (p.priceUsd < DEPEG_THRESHOLD_USD) {
      triggers.push({
        kind: "depeg",
        symbol: p.symbol,
        priceUsd: p.priceUsd,
        thresholdUsd: DEPEG_THRESHOLD_USD,
      });
    }
  }

  const hasDepeg = triggers.some((t) => t.kind === "depeg");
  const hasYield = triggers.some((t) => t.kind === "yield_drop");
  const aaveBps = rates.find((r) => r.protocol === "aave-v3")?.supplyApyBps;

  let health: VibeShiftResult["health"] = "healthy";
  if (hasDepeg) health = "critical";
  else if (
    hasYield &&
    typeof aaveBps === "number" &&
    aaveBps < YIELD_CRITICAL_BPS
  ) {
    health = "critical";
  } else if (hasYield) health = "warning";

  return {
    triggers,
    suggestedAction: buildSuggestion(triggers, rates),
    health,
  };
}
