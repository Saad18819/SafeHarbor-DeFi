# SafeHarbor DeFi

A **DeFi Treasury Manager** dashboard for startups: stablecoin runway, mocked protocol yields (Aave V3 / Compound V3), risk monitoring (“Vibe Shift”), and optional login/onboarding. Built for a clean, corporate light UI with dev-side market simulation controls.

## Features

- **Treasury overview** — Total balance, stables vs. on-chain yield split, runway (balance ÷ monthly burn).
- **Protocol rates** — Simulated supply APY with viem-style encodings; reference mainnet addresses for illustration.
- **Risk monitor** — Alerts when stable prices fall below peg thresholds or Aave yield breaches configured floors.
- **Simulation panel** — Collapsible dev controls: stable price sliders ($0.90–$1.10), Aave/Compound APY inputs, burn rate (updates UI live via Zustand).
- **Auth UX** — `/login` with profile (name/email) stored in `sessionStorage`, header profile menu.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) · TypeScript  
- [Tailwind CSS](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/)  
- [TanStack Query](https://tanstack.com/query) · [Zustand](https://zustand-demo.pmnd.rs/) · [Wagmi](https://wagmi.sh/) / [Viem](https://viem.sh/)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Dev settings** at the bottom of the dashboard to tweak mock prices and APYs.

```bash
npm run build   # production build
npm run start   # run production server
```

## Environment

Optional: `NEXT_PUBLIC_ETH_RPC_URL` for Wagmi’s default mainnet transport (mock reads do not require a wallet).

## Repository

Remote: [github.com/Saad18819/SafeHarbor-DeFi](https://github.com/Saad18819/SafeHarbor-DeFi)

---

Demo-quality mocks only — production treasuries need real custody, compliance, and audited contracts.
