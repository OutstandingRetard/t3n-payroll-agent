# T3N Enterprise Agent Submission — Payroll-Boundary Agent

**Submission by:** OutstandingRetard (Superteam Earn)
**Sponsor:** Terminal 3 Network
**Bounty:** "Try out new docs to build a trusted agent with T3N that we can distribute / host"
**Repo:** https://github.com/OutstandingRetard/t3n-payroll-agent
**Date:** 2026-09-05

---

## What I built

An enterprise **payroll-boundary agent** on the Terminal 3 Agent Developer Kit (ADK).
It authenticates a verified `did:t3n:*` identity inside a TEE, resolves placeholder
bank/account references *inside the enclave*, and triggers transfers **without the
model ever holding raw account numbers or PII**.

This addresses the core enterprise trust problem: letting an AI agent take real-world
actions (pay people) without ever exposing sensitive keys, account numbers, or private
data to the model context.

## How it works

1. **Sign up / claim** — Google SSO at the terminal3.io claim page → DID + API key issued.
2. **Authenticated TEE session** — `@terminal3/t3n-sdk` opens an encrypted session; all
   crypto runs inside the WASM component; the API key never leaves the box.
3. **DID verification** — `client.authenticate(createEthAuthInput(address))` proves
   `wallet → did:t3n:…`.
4. **Protected payroll action** — the agent only ever references a placeholder
   (`account:emp-4827`); T3N substitutes the real destination inside the TEE, applies
   the transfer, and writes a signed audit row to the ledger.

## Why it's useful & maintainable

- **No PII in model context.** Raw account numbers never reach the LLM.
- **Tiny, typed surface.** Strict TypeScript, ESM, ~4 source files, zero config debt.
- **One env var to run.** `T3N_API_KEY` only.
- **Extendable.** Same authenticated client drops into bank transfer, Stripe
  e-commerce procurement, or e-visa form-filling actions.
- **Framework-agnostic** via the SDK + MCP server (Claude Desktop, Cursor, custom hosts).

## Setup & usage

```bash
git clone https://github.com/OutstandingRetard/t3n-payroll-agent
cd t3n-payroll-agent
npm install
cp .env.example .env   # set T3N_API_KEY
npm run typecheck      # 0 errors
npm run auth:check     # DID session + credit balance
npm run dev            # payroll-boundary demo
```

## Repo structure

```
src/client.ts      # authenticated T3N client (lazy, sandbox env)
src/auth_check.ts  # DID + credits verification
src/index.ts       # payroll-boundary demo (protected-action shape)
```

## Status note

Repo is fully built and CI-verified for types. The live sandbox auth run requires a
T3N sandbox API key (issued on the claim page). I built, tested the graceful no-key
path, and can attach live screenshots + any bugs found once the key is provisioned.

---
*Generated as part of the T3N ADK Quickstart + Walkthrough per the bounty scope.*