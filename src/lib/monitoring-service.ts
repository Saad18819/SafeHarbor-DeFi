import type { StablecoinPrice } from "./price-feed";
import type { StableSupplyApy } from "./protocol-mock-provider";
import {
  evaluateVibeShift,
  type VibeShiftResult,
} from "./vibe-shift-engine";

export { YIELD_THRESHOLD_BPS, DEPEG_THRESHOLD_USD } from "./vibe-shift-engine";

/**
 * Pure “monitoring tick”: feed the latest protocol APYs + oracle prices.
 * Wire this to React Query intervals, a worker, or a cron job in production.
 */
export function runVibeShiftMonitor(
  rates: StableSupplyApy[],
  prices: StablecoinPrice[]
): VibeShiftResult {
  return evaluateVibeShift(rates, prices);
}
