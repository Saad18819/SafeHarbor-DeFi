import type { Address } from "viem";
import {
  encodeAbiParameters,
  formatUnits,
  keccak256,
  parseAbiParameters,
  stringToHex,
} from "viem";

/** Canonical placeholder addresses for Aave V3 / Compound V3 style pools (mainnet). */
export const PROTOCOL_ADDRESSES = {
  aaveV3Pool: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2" as Address,
  compoundUSDC: "0xc3d688B66703497DAA19211EEdff47f25384cdc3" as Address,
} as const;

export type ProtocolId = "aave-v3" | "compound-v3";

export type StableSupplyApy = {
  protocol: ProtocolId;
  label: string;
  /** Basis points per year, e.g. 420 = 4.20% */
  supplyApyBps: number;
  /** Simulated on-chain slot id for viem-style hashing */
  mockSlot: `0x${string}`;
};

const SEED = stringToHex("defi-treasury-mock", { size: 32 });

function pseudoRate(protocol: ProtocolId, minuteBucket: number): number {
  const mix = keccak256(
    encodeAbiParameters(
      parseAbiParameters("bytes32 seed, string protocol, uint256 minuteBucket"),
      [SEED, protocol, BigInt(minuteBucket)]
    )
  );
  const n = BigInt(mix);
  if (protocol === "aave-v3") {
    // 3.0% – 5.5% range (bps)
    const base = 300 + Number(n % BigInt(250));
    return base;
  }
  // compound: 2.8% – 5.0%
  const base = 280 + Number(n % BigInt(220));
  return base;
}

export type MockRatesOptions = {
  /** Forces Aave below the yield guard for demos */
  stressYield?: boolean;
};

/**
 * Mock “read” of supply APY using viem primitives (encoding + hashing) so the
 * data path resembles production `readContract` / oracle aggregation.
 */
/** Build protocol rows from explicit bps (simulation / overrides). */
export function buildStableSupplyApyFromBps(
  aaveBps: number,
  compoundBps: number
): StableSupplyApy[] {
  const a = Math.max(0, Math.round(aaveBps));
  const c = Math.max(0, Math.round(compoundBps));
  return [
    {
      protocol: "aave-v3",
      label: "Aave V3 · USDC",
      supplyApyBps: a,
      mockSlot: keccak256(
        encodeAbiParameters(parseAbiParameters("address pool, uint256 apyBps"), [
          PROTOCOL_ADDRESSES.aaveV3Pool,
          BigInt(a),
        ])
      ),
    },
    {
      protocol: "compound-v3",
      label: "Compound V3 · USDC",
      supplyApyBps: c,
      mockSlot: keccak256(
        encodeAbiParameters(parseAbiParameters("address pool, uint256 apyBps"), [
          PROTOCOL_ADDRESSES.compoundUSDC,
          BigInt(c),
        ])
      ),
    },
  ];
}

export function getMockSupplyApyRates(
  now = Date.now(),
  options?: MockRatesOptions
): StableSupplyApy[] {
  const minuteBucket = Math.floor(now / 60_000);
  const aaveBps = options?.stressYield
    ? 350
    : pseudoRate("aave-v3", minuteBucket);
  const compoundBps = pseudoRate("compound-v3", minuteBucket + 7);

  return buildStableSupplyApyFromBps(aaveBps, compoundBps);
}

export function bpsToPercent(bps: number): string {
  const wei = BigInt(bps) * BigInt(1e14);
  return formatUnits(wei, 18);
}

export function formatApyPercent(bps: number): string {
  const pct = bps / 100;
  return pct.toFixed(2);
}
