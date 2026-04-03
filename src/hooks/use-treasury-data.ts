"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStablecoinPrices } from "@/lib/price-feed";
import { getMockSupplyApyRates } from "@/lib/protocol-mock-provider";

export function useProtocolRatesQuery(stressYield: boolean) {
  return useQuery({
    queryKey: ["protocol-rates", stressYield],
    queryFn: () => getMockSupplyApyRates(Date.now(), { stressYield }),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useStablecoinPricesQuery(stressDepeg: boolean) {
  return useQuery({
    queryKey: ["stable-prices", stressDepeg],
    queryFn: () => fetchStablecoinPrices({ stressDepeg }),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
