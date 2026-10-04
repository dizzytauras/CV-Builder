# YIF CV Reasoning Prototype - OpenAI Edition

A GitHub-ready, Vercel-native version of the evidence-grounded CV tailoring prototype using the OpenAI Responses API.

The product is intentionally not a one-click CV rewriter. Its workflow is:

1. Read a CV and a job description.
2. Extract a factual experience record from the CV.
3. Parse the JD into explicit and inferred requirements.
4. Ask the Fellow to confirm the factual record.
5. Map each requirement to direct, transferable, partial or unsupported evidence.
6. Ask targeted discovery questions for important gaps.
7. Require the Fellow to verify any newly surfaced evidence and AI interpretation.
8. Curate what deserves limited CV space: foreground, keep, compress, omit or consider adding.
9. Rewrite only from confirmed evidence.
10. Run a second semantic verifier against every proposed/edited bullet.
11. Preserve unresolved gaps and accepted uncertainty in the final audit.

## Repository structure

```text
yif-cv-openai-vercel-ready/
├── index.html            # Complete browser UI and workflow
├── api/
│   ├── config.js         # Tells the UI whether an access code is required
│   └── llm.js            # Serverless OpenAI Responses API proxy; API key stays server-side
├── scripts/
│   ├── check-frontend.mjs
│   └── smoke.mjs
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

## What stays in the browser

- CV/JD file parsing for text-based PDF and DOCX files
- Current session state
- Evidence review decisions
- Curation decisions
- Final preview and downloaded text summary

The prototype does not intentionally persist CV/JD data in a database.

## What stays on the server

- `OPENAI_API_KEY`
- optional `ACCESS_CODE`
- OpenAI Responses API calls through `/api/llm`

Never put your real model API key inside `index.html` or commit it to GitHub.

## 1. Put this on GitHub

Create an empty GitHub repository, extract this ZIP locally, then run:

```bash
git init
git add .
git commit -m "Initial CV reasoning prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Or upload the extracted files through GitHub's web interface.

## 2. Deploy from GitHub to Vercel

1. Sign in to Vercel.
2. Choose **Add New → Project**.
3. Import the GitHub repository.
4. Keep the project as a plain Vercel project; no framework is required.
5. In **Project Settings → Environment Variables**, add:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - optionally `ACCESS_CODE`
   - optionally `MAX_OUTPUT_TOKENS`
   - optionally `RATE_LIMIT_PER_MINUTE`
6. Deploy.

Every later push to the connected branch can trigger a new Vercel deployment.

## 3. Environment variables

Copy `.env.example` for reference. Do not commit a real `.env` file.

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-6.1-sol
ACCESS_CODE=optional_demo_password
MAX_OUTPUT_TOKENS=4096
RATE_LIMIT_PER_MINUTE=20
```

Use a model ID available to your OpenAI API project. The example uses `gpt-6.1-sol`; you can change it without changing the frontend.

This repository uses OpenAI's **Responses API** (`POST /v1/responses`) rather than the retired Assistants API. The CV/JD workflow remains application-controlled; no OpenAI conversation object is required for the current prototype. Model responses are requested as JSON-only text and then parsed/validated by the server.

## 4. Local development

The simplest way to emulate Vercel's static hosting + API functions locally is the Vercel CLI:

```bash
cp .env.example .env.local
# edit .env.local and add your real values
npm run dev
```

`npm run dev` runs `npx vercel dev`, so the first run may download the Vercel CLI.

## 5. Run the repository checks

```bash
npm test
```

This checks the inline frontend JavaScript for syntax errors and smoke-tests the API guards without making a paid model call.

## Security / deployment notes

- The OpenAI API key is server-side only.
- `/api/llm` checks an optional access code, input size and a best-effort per-instance rate limit.
- The server accepts only the known prompt family used by this UI; CV/JD text is kept in the `DATA` section and the model is told to treat it as untrusted content.
- Vercel serverless instances are ephemeral. The included in-memory rate limit is useful for a controlled prototype but is **not a production-grade global rate limiter**. For a public launch, use a durable rate-limit store/service and authentication.
- Before real institutional use, define retention, deletion, consent, access-control and model-provider governance policies.
- The browser loads PDF.js and Mammoth from cdnjs for client-side PDF/DOCX extraction. Manual paste remains the fallback if those libraries cannot load.
- Image-only/scanned PDFs are not OCR'd by this prototype.

## Product integrity rules implemented in the UI

- Facts, interpretations and writing remain separate.
- A team outcome is not converted into an individual outcome unless supplied by the user.
- Participation is not automatically reframed as leadership.
- Exposure is not automatically reframed as proficiency.
- `partial` and `unsupported` are legitimate states.
- Human `Agree / Partly / Disagree` decisions constrain later evidence matching.
- Manual edits are re-verified before acceptance.
- Semantic uncertainty remains visible in the final audit.

## Next engineering upgrades for a public product

The current repository is appropriate for a controlled prototype/demo. For a larger deployment, consider:

- task-specific server endpoints instead of one `/api/llm` route;
- durable rate limiting and authentication;
- encrypted persistent experience-bank storage, if persistence becomes a requirement;
- server-side schema validation for every model response;
- structured observability/error logging without storing raw CV contents;
- automated end-to-end browser tests;
- institutional privacy and data-retention controls;
- final DOCX/PDF CV rendering only after the evidence-grounding workflow is stable.

## Extra features

- **Download for WordPad (.rtf)**: final experience sections (not a full CV) as a Rich Text file named tailored_cv_content.rtf that opens in WordPad or Word. Requires the "can defend" checkbox.
- **Before/after evidence map** and **session scoreboard** show what discovery changed and how many claims were blocked or flagged.
- **Temptation test** (demo mode only): shows an inflated claim being caught by the validators.
- **Trace to source** on each rewrite highlights the CV text behind the claim.
- **Experience bank**: save confirmed experiences as JSON and load them in a later session for a different job. Nothing is stored on the server.
- **Demo mode**: fictional Fellow and job so you can present without real data.

All model calls still go through `/api/llm` to the OpenAI Responses API; no other provider is used.
