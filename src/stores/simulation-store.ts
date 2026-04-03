import { create } from "zustand";

const clampPrice = (n: number) =>
  Math.min(1.1, Math.max(0.9, Math.round(n * 10000) / 10000));

export type SimulationStore = {
  /** USD price per $1 face */
  priceUSDC: number;
  priceUSDT: number;
  pricePYUSD: number;
  /** Percent, e.g. 4.25 = 4.25% APY */
  aaveApyPercent: number;
  compoundApyPercent: number;
  monthlyBurnUsd: number;
  setPriceUSDC: (n: number) => void;
  setPriceUSDT: (n: number) => void;
  setPricePYUSD: (n: number) => void;
  setAaveApyPercent: (n: number) => void;
  setCompoundApyPercent: (n: number) => void;
  setMonthlyBurnUsd: (n: number) => void;
  reset: () => void;
};

const defaults = {
  priceUSDC: 1,
  priceUSDT: 1,
  pricePYUSD: 1,
  aaveApyPercent: 4.5,
  compoundApyPercent: 4,
  monthlyBurnUsd: 85_000,
} as const;

export const useSimulationStore = create<SimulationStore>((set) => ({
  ...defaults,
  setPriceUSDC: (n) => set({ priceUSDC: clampPrice(n) }),
  setPriceUSDT: (n) => set({ priceUSDT: clampPrice(n) }),
  setPricePYUSD: (n) => set({ pricePYUSD: clampPrice(n) }),
  setAaveApyPercent: (n) =>
    set({ aaveApyPercent: Math.min(25, Math.max(0, n)) }),
  setCompoundApyPercent: (n) =>
    set({ compoundApyPercent: Math.min(25, Math.max(0, n)) }),
  setMonthlyBurnUsd: (n) =>
    set({ monthlyBurnUsd: Math.max(0, Math.round(n)) }),
  reset: () => set({ ...defaults }),
}));
