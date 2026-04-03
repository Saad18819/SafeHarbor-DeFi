import { create } from "zustand";

export type TreasurySplit = {
  fiatStablecoinsUsd: number;
  defiYieldUsd: number;
};

type TreasuryState = {
  totalUsd: number;
  split: TreasurySplit;
  lastRebalanceAt: number | null;
  setSplit: (split: Partial<TreasurySplit>) => void;
  /** Simulates routing stable liquidity into a yield venue (e.g. Morpho / Aave). */
  executeRebalanceSimulation: (amountUsd?: number) => void;
};

const initialSplit: TreasurySplit = {
  fiatStablecoinsUsd: 2_350_000,
  defiYieldUsd: 1_100_000,
};

export const useTreasuryStore = create<TreasuryState>((set, get) => ({
  totalUsd: initialSplit.fiatStablecoinsUsd + initialSplit.defiYieldUsd,
  split: initialSplit,
  lastRebalanceAt: null,
  setSplit: (partial) => {
    const next = { ...get().split, ...partial };
    set({
      split: next,
      totalUsd: next.fiatStablecoinsUsd + next.defiYieldUsd,
    });
  },
  executeRebalanceSimulation: (amountUsd = 500_000) => {
    const { split } = get();
    const next: TreasurySplit = { ...split };
    const take = Math.min(amountUsd, next.fiatStablecoinsUsd);
    next.fiatStablecoinsUsd -= take;
    next.defiYieldUsd += take;
    set({
      split: next,
      totalUsd: next.fiatStablecoinsUsd + next.defiYieldUsd,
      lastRebalanceAt: Date.now(),
    });
  },
}));
