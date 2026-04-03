import type { Address } from "viem";
import { encodeFunctionData, parseAbi } from "viem";

/** Minimal pool reader ABI for illustrative `eth_call` / `simulateContract` calldata. */
const poolAbi = parseAbi([
  "function getReserveData(address asset) view returns (uint256 reserveData)",
]);

/**
 * Encode a call you would pass to `simulateContract` / `eth_call` against lending pools.
 * The dashboard uses mocked APYs; this shows the wagmi/viem integration path.
 */
export function encodeReserveDataCall(asset: Address): `0x${string}` {
  return encodeFunctionData({
    abi: poolAbi,
    functionName: "getReserveData",
    args: [asset],
  });
}
