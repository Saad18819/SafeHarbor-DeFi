export type StablecoinSymbol = "USDC" | "USDT" | "PYUSD";

export type StablecoinPrice = {
  symbol: StablecoinSymbol;
  priceUsd: number;
  source: "coingecko" | "mock";
};

const COINGECKO_IDS: Record<StablecoinSymbol, string> = {
  USDC: "usd-coin",
  USDT: "tether",
  PYUSD: "paypal-usd",
};

export type PriceFetchOptions = {
  /** Forces a sub-peg print for demos */
  stressDepeg?: boolean;
};

/**
 * Fetch USD prices from CoinGecko; falls back to $1.00 mock if the request fails.
 */
export async function fetchStablecoinPrices(
  options?: PriceFetchOptions
): Promise<StablecoinPrice[]> {
  if (options?.stressDepeg) {
    return [
      { symbol: "USDC", priceUsd: 0.9997, source: "mock" },
      { symbol: "USDT", priceUsd: 0.992, source: "mock" },
      { symbol: "PYUSD", priceUsd: 0.9991, source: "mock" },
    ];
  }
  const ids = Object.values(COINGECKO_IDS).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = (await res.json()) as Record<string, { usd: number }>;
    const out: StablecoinPrice[] = (
      Object.entries(COINGECKO_IDS) as [StablecoinSymbol, string][]
    ).map(([symbol, id]) => ({
      symbol,
      priceUsd: data[id]?.usd ?? 1,
      source: "coingecko" as const,
    }));
    return out;
  } catch {
    return [
      { symbol: "USDC", priceUsd: 0.9998, source: "mock" },
      { symbol: "USDT", priceUsd: 0.9994, source: "mock" },
      { symbol: "PYUSD", priceUsd: 0.9996, source: "mock" },
    ];
  }
}
