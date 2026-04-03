import type { StablecoinPrice } from "./price-feed";
import {
  buildStableSupplyApyFromBps,
  type StableSupplyApy,
} from "./protocol-mock-provider";

export type SimulationPrices = {
  usdc: number;
  usdt: number;
  pyusd: number;
};

export function simulationPricesToFeed(
  p: SimulationPrices
): StablecoinPrice[] {
  return [
    { symbol: "USDC", priceUsd: p.usdc, source: "mock" },
    { symbol: "USDT", priceUsd: p.usdt, source: "mock" },
    { symbol: "PYUSD", priceUsd: p.pyusd, source: "mock" },
  ];
}

export function simulationApyToRates(
  aaveApyPercent: number,
  compoundApyPercent: number
): StableSupplyApy[] {
  const aaveBps = Math.round(aaveApyPercent * 100);
  const compoundBps = Math.round(compoundApyPercent * 100);
  return buildStableSupplyApyFromBps(aaveBps, compoundBps);
}
