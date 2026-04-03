import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";

/** Mainnet RPC for protocol mocks; wallet connect uses demo flow on `/login` (no optional connector bundles). */
export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_ETH_RPC_URL ?? "https://eth.llamarpc.com"
    ),
  },
  ssr: true,
});
