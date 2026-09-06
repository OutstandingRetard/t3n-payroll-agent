# T3N Payroll Agent

An enterprise **payroll-boundary agent** built on the [Terminal 3 (T3N) Agent
Developer Kit](https://terminal3.io/products/agent-developer-kit). It authenticates
a verified `did:t3n:*` identity inside a TEE, resolves placeholder bank/account
references *inside the enclave*, and triggers transfers without the model ever
holding raw account numbers.

Demonstrates the full T3N sandbox quickstart: SSO signup → DID + API key →
authenticated TEE session → protected (payroll) action → signed audit row.

## Why this is genuinely useful / maintainable

- **No PII in model context.** The agent only ever references
  `account:emp-4827`; real numbers are substituted inside the TEE by T3N.
- **Zero-credential setup to run.** One API key from the claim page, one env var.
- **Tiny, typed surface.** Strict TypeScript, ~4 source files. Easy to extend by
  adding ADK protected actions (bank transfer, Stripe procurement, e-visa
  forms) under the same authenticated client.

## Prerequisites

- Node.js ≥ 20 (uses native `process.loadEnvFile` path style, ESM)
- A T3N sandbox key: <https://www.terminal3.io/claim-page> (sign in with Google,
  copy the key from the success screen, save it once)

## Setup

```bash
npm install
cp .env.example .env
# edit .env and set T3N_API_KEY=<your sandbox key>
```

## Usage

```bash
npm run typecheck   # compile check, no emit
npm run auth:check  # connect to the TEE, print DID-bound session + credits
npm run dev         # run the payroll-boundary demo
```

## Project layout

```
src/client.ts      # authenticated T3N client (lazy, sandbox env)
src/auth_check.ts  # verify DID + credits end to end
src/index.ts       # payroll-boundary demo (protected-action shape)
```

## License

MIT