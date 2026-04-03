# SafeHarbor DeFi

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**SafeHarbor DeFi** is a startup-style **treasury dashboard** for tracking stablecoin balances, simulated DeFi yields (Aave V3 / Compound V3), and automated risk signals (“Vibe Shift”). UI is a light, Stripe-inspired layout; market behavior can be overridden in real time via a collapsible **Dev settings** panel.

**Repository:** [github.com/Saad18819/SafeHarbor-DeFi](https://github.com/Saad18819/SafeHarbor-DeFi)

## Clone & run

```bash
git clone https://github.com/Saad18819/SafeHarbor-DeFi.git
cd SafeHarbor-DeFi
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at `/login` (name + email + optional onboarding). Use **Dev settings** at the bottom of the dashboard to move stable prices, APYs, and burn — the portfolio, health gauge, and alerts update immediately.

| Script        | Description        |
| ------------- | ------------------ |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Features

| Area | What it does |
| ---- | ------------ |
| **Treasury** | Total balance, stables vs. yield split, runway (balance ÷ monthly burn). |
| **Protocols** | Mock supply APY for Aave / Compound; viem-style calldata examples. |
| **Risk monitor** | Peg checks (&lt; $0.995), yield floor (&lt; 4% Aave), suggested actions. |
| **Simulation** | Sliders $0.90–$1.10 per stable; numeric APY and burn; Zustand-backed live UI. |
| **Auth** | Session profile in `sessionStorage`, header profile menu. |

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · [shadcn/ui](https://ui.shadcn.com/) · TanStack Query · Zustand · Wagmi / Viem

## Environment

Optional: `NEXT_PUBLIC_ETH_RPC_URL` — default Ethereum RPC for Wagmi (mock flows work without a wallet).

## Disclaimer

This project uses **demonstration mocks** only. Real treasury operations require proper custody, legal review, and audited smart contracts.

---

Maintained in [Saad18819/SafeHarbor-DeFi](https://github.com/Saad18819/SafeHarbor-DeFi).
