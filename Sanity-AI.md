🎯 High-level goal (tell this to Cursor)

We want an automated “enrichment” pipeline for our Sanity product documents:

Each product already has a description field (in Persian).

We want to generate other fields (SEO + marketing) using OpenAI, based on the description and its keywords.

The tool should:

Find products that have description but are missing some target fields.

Call OpenAI with that description and get structured JSON (no free text).

Patch only the missing fields back into Sanity using the official @sanity/client.

Mark docs as processed so we don’t regenerate again and again.

Implementation can be a standalone script or a small service/worker, but must use:

@sanity/client (official JS client) for queries/mutations. 
Sanity.io
+1

Official OpenAI Node SDK (openai) for LLM calls. 
GitHub
+1

🧩 Step 1 – Set up environment variables (Cursor: ensure this exists)

Ask Cursor to add or check environment variables in whichever system you use (.env, Cloudflare env, Vercel env, etc.):

You will need at least:

SANITY_PROJECT_ID – from manage.sanity.io (Project → API)

SANITY_DATASET – e.g. production

SANITY_API_TOKEN – a token with write permission (Editor or similar) 
Sanity.io
+1

OPENAI_API_KEY – from OpenAI dashboard 
OpenAI Platform
+1

Example .env (Cursor can adapt to your setup):

SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_write_token
OPENAI_API_KEY=sk-...


Instruction to Cursor:
Locate how env variables are currently handled in this project and ensure these four keys exist and can be read from Node/TypeScript code.

🔌 Step 2 – Configure a reusable Sanity client

We must follow the official pattern for @sanity/client:

Use createClient({ projectId, dataset, useCdn, apiVersion, token }). 
Sanity.io
+1

Set useCdn: false for writes.

Set apiVersion to a fixed date string (e.g. today’s UTC) as recommended in docs. 
Sanity.io
+1

Instruction to Cursor:

Search the repo for any existing Sanity client usage (createClient or @sanity/client).

If there is already a central client config, reuse it and just ensure:

It reads projectId and dataset from env.

It sets useCdn: false for the code that will do mutations (can be a separate “server client” if needed).

It sets a valid apiVersion (string like '2025-02-06').

It uses token: process.env.SANITY_API_TOKEN for server-side/mutation code.

If there is no existing central client, create a new shared module, e.g. lib/sanityClient.(ts|js) which exports a configured client.

A minimal example Cursor can follow (this does not depend on your structure, only on env):

// Example: lib/sanityClient.ts
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  useCdn: false, // we want fresh data + mutations
  apiVersion: '2025-02-06', // fixed date as per Sanity docs
  token: process.env.SANITY_API_TOKEN,
});

🤖 Step 3 – Configure an OpenAI client

We’ll use the official OpenAI Node SDK:

Docs show:

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
``` :contentReference[oaicite:6]{index=6}  

**Instruction to Cursor:**

1. Check if there’s already an OpenAI client wrapper in the repo.
2. If yes, reuse it.
3. If not, create a simple module, e.g. `lib/openaiClient.(ts|js)`:

```ts
// lib/openaiClient.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


This module should be imported by our enrichment logic.

🧱 Step 4 – Decide which fields the AI should generate

We must not assume your schema, so:

Instruction to Cursor:

Locate the Sanity schema for your product document type. This is typically in something like schemas/product.(ts|js) or similar.

Identify:

description field (source text).

All target fields that should be auto-generated from the description. Examples (you adapt):

shortDescription (short Farsi summary).

seoTitle.

seoDescription.

tags (array of strings).

Add (if useful) a boolean field to product to mark processed docs:

{
  name: 'aiEnriched',
  title: 'AI Enriched',
  type: 'boolean',
  readOnly: true,
}


In the enrichment module, define a list of target field names. E.g.:

const TARGET_FIELDS = [
  'shortDescription',
  'seoTitle',
  'seoDescription',
  'tags',
] as const;


Cursor should ensure these names match the actual schema exactly.

🔍 Step 5 – Query Sanity for products that need enrichment (GROQ)

We’ll use a GROQ query via sanityClient.fetch that:

Filters _type == "product".

Requires description to be defined.

Optionally checks aiEnriched != true.

We’ll handle “missing fields” at runtime by checking for null/undefined in JS.

Sanity docs confirm:

fetch(query, params?) is the right method. 
Sanity.io
+1

defined(field) is a valid GROQ function. 
Sanity.io
+1

Instruction to Cursor:

Create a function (in a new module like scripts/enrichProducts or similar) that:

Uses sanityClient.fetch with a GROQ query like:

*[
  _type == "product" &&
  defined(description) &&
  (aiEnriched != true)
]{
  _id,
  _type,
  title,
  description,
  // Include all target fields here:
  shortDescription,
  seoTitle,
  seoDescription,
  tags,
  aiEnriched
}


Returns an array of strongly-typed objects, e.g.:

type ProductForEnrichment = {
  _id: string;
  _type: 'product';
  title?: string;
  description?: string;
  shortDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  aiEnriched?: boolean;
};


Optionally take a limit parameter to avoid processing the entire dataset at once.

This is a pure data-fetch step; no mutations yet.

🧠 Step 6 – Design the OpenAI prompt and return JSON only

We want the model to:

Look at description (and maybe title).

Extract & reuse important keywords from that text.

Generate:

shortDescription (1–2 sentences)

seoTitle (max ~60 chars)

seoDescription (meta, ~130–150 chars)

tags (5–10 Farsi keywords, array of strings)

Return only valid JSON, no extra text.

Instruction to Cursor:

Create a function, e.g. generateFieldsFromDescription(description: string, title?: string, fieldsToFill: string[]): Promise<GeneratedFields>.

Inside it, call openai.chat.completions.create(...) (or responses.create if you prefer the new API, but chat is fine) as in the docs. 
OpenAI Platform
+1

Use:

a system prompt to set behavior, including “return JSON only”.

a user prompt that includes:

product title

product description

list of field names we want to fill

example of JSON shape.

Example prompt (Cursor should adapt text, especially field names):

System:
You are an expert Persian marketing copywriter and SEO specialist.
You receive a product description and must generate specific fields for a Sanity CMS "product" document.

Rules:
- All user-facing text must be in Persian (Farsi).
- Reuse and emphasize important keywords from the description.
- Be concise but persuasive and natural.
- If a field does not make sense, set it to null.
- Return ONLY valid JSON, no extra commentary.

User:
Product title (optional): {title or "N/A"}

Product description:
"""{description}"""

Fields to fill: {JSON.stringify(fieldsToFill)}

Return a JSON object with this shape:
{
  "shortDescription": string | null,
  "seoTitle": string | null,
  "seoDescription": string | null,
  "tags": string[] | null
}

Only fill keys listed in "Fields to fill". For others, use null.


After the API call, parse the string content with JSON.parse. If parsing fails, log the raw content and throw an error so we can debug.

🧷 Step 7 – Decide which fields to patch & update via @sanity/client

Now we combine:

The product from Sanity.

The JSON from OpenAI.

A patch that only sets missing fields.

Sanity’s JS client docs show the canonical pattern:

client
  .patch('doc-id')
  .set({ someField: 'value' })
  .commit()
``` :contentReference[oaicite:10]{index=10}  

**Instruction to Cursor:**

1. Create a function like `enrichSingleProduct(product: ProductForEnrichment): Promise<void>`.
2. Inside it:
   - Determine which target fields are **currently empty** on this product:

     ```ts
     const missingFields = TARGET_FIELDS.filter((field) => {
       const value = (product as any)[field];
       return value === undefined || value === null || value === '';
     });
     ```

   - If `missingFields.length === 0`, log and return (nothing to do).
   - If `description` is missing, log and skip (shouldn’t normally happen).
3. Call `generateFieldsFromDescription(description, title, missingFields)`.
4. Build a `patchData` object where you only include generated values for fields that:
   - were missing on the product, and
   - are non-null/non-empty in the model output.
5. If `patchData` is non-empty:
   - Add `aiEnriched: true` (or similar) so we can skip this doc next time.
   - Call:

     ```ts
     await sanityClient
       .patch(product._id)
       .set(patchData)
       .commit();
     ```

   - This follows the official `patch().set().commit()` pattern. :contentReference[oaicite:11]{index=11}  

6. If you want to be extra safe about not overwriting concurrent changes, you can also use `ifRevisionId` with `_rev`, as described in the Transactions docs. :contentReference[oaicite:12]{index=12}  

---

## 🌀 Step 8 – Orchestrator: loop over all products that need enrichment

Now we need an orchestrator function that:

1. Fetches products with the GROQ in Step 5.
2. Loops over them and calls `enrichSingleProduct` for each.
3. Logs progress.
4. Optionally adds a small delay between items (e.g. `setTimeout` 200–500ms) to be nice to rate limits.

**Instruction to Cursor:**

Create an `async function runEnrichment()` that:

```ts
async function runEnrichment() {
  const products = await fetchProductsNeedingEnrichment(/* maybe a limit */);

  if (products.length === 0) {
    console.log('No products need enrichment. ✅');
    return;
  }

  console.log(`Found ${products.length} products to enrich.`);

  for (const product of products) {
    try {
      await enrichSingleProduct(product);
      // Optional delay:
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error enriching product ${product._id}`, error);
    }
  }

  console.log('Finished AI enrichment run. 🎉');
}


This function must be exported from the enrichment module so we can:

Call it from a CLI script, or

Call it from an API / Worker.

🚀 Step 9 – Entry point(s): how and when it runs

You have several ways to trigger this. Cursor should implement at least one now; you can extend later.

Option A – Simple CLI script (fastest to test)

Instruction to Cursor:

Create a small file like scripts/run-enrichment.(ts|js) that:

Imports runEnrichment.

Calls it.

Add an npm script in package.json:

{
  "scripts": {
    "enrich:products": "node dist/scripts/run-enrichment.js" // or ts-node if you use it
  }
}


You run it manually whenever you want:

npm run enrich:products


This is the easiest and safest first step.

Option B – Webhook / Worker / API endpoint (automatic on save)

If later you want it to auto-run when you create/edit a product:

Instruction to Cursor:

Configure a Sanity webhook in the Sanity project that triggers on:

Document type: product

Events: create and update

Target URL: an API route / Worker in your stack.

Implement an HTTP endpoint (Cloudflare Worker / Next.js API route / etc.) that:

Parses the webhook payload.

Extracts the document _id from the payload.

Fetches just that product from Sanity.

Calls enrichSingleProduct on that product only.

Responds with 200 JSON if everything goes fine.

This reuses the exact same core logic; only the trigger changes from CLI to webhook.

📦 What Cursor should deliver at the end

When Cursor is done, we should have:

A Sanity client module configured according to official docs (with projectId, dataset, apiVersion, useCdn, token). 
Sanity.io
+1

An OpenAI client module using the official Node SDK. 
GitHub
+1

A product schema where:

description exists.

Target fields (e.g. seoTitle, seoDescription, etc.) are clearly defined.

Optional aiEnriched boolean is available.

A module (e.g. enrichProducts) that contains:

fetchProductsNeedingEnrichment()

generateFieldsFromDescription(...)

enrichSingleProduct(...)

runEnrichment()

At least one entry point (CLI script) that you can run to process products.

All OpenAI outputs are validated JSON and only missing fields are patched, in line with Sanity’s patch API.




############################################### follow up prompt 

Prompt for Cursor: add a “Generate AI Content” document action

We already have (or are planning) server-side logic that enriches a product document using OpenAI and the Sanity Content Lake (via @sanity/client).
Now I want a custom document action button inside Sanity Studio so that when I’m editing a product in /studio, I can click a button called “Generate AI content” and trigger that enrichment for this document.

Please implement this in a way that does not expose any secrets (Sanity token, OpenAI key) in the browser. Use the official Sanity Document Actions API. 
Sanity.io
+1

1. Backend: single-document enrichment endpoint

Find the existing enrichment logic we designed (or create it if missing):

It should already know how to:

Take a Sanity document ID.

Fetch that document from Sanity using @sanity/client.

Read description and other fields.

Call OpenAI using OPENAI_API_KEY.

Patch back generated fields into Sanity.

If needed, wrap this into a function like:

async function enrichProductById(documentId: string): Promise<void> { ... }


Create an HTTP endpoint (Cloudflare Worker route, Next.js API route, etc.) that:

Accepts POST with JSON { documentId: string }.

Calls enrichProductById(documentId).

Returns a JSON response like:

{ "ok": true }


Handles errors with a clear status and message.

Make sure all tokens (SANITY_API_TOKEN, OPENAI_API_KEY) stay server-side and are read from environment variables there (not in Studio).

I don’t care what the endpoint path is, but assume something like:
POST https://<my-backend>/api/enrich-product

2. Frontend: create a custom document action component

Use the official Sanity Document Actions pattern: a function that returns { label, onHandle, ... }. 
Sanity.io

Create a new file in the Studio codebase, e.g. ./studio/actions/generateAiContentAction.tsx (or similar path).

Define a document action component called GenerateAiContentAction.
It should:

Only show for documents of type "product".

Either check props.type === 'product' and return null for others (as in the docs example). 
Sanity.io

Show a label like "Generate AI content".

On click:

Call the backend endpoint from step 1.

Pass the current document ID (props.id) as documentId.

Show some basic loading state so the user sees it’s working.

Call props.onComplete() when done, so the Studio refreshes the document state.

Example structure (Cursor should adapt imports/paths as needed):

// studio/actions/generateAiContentAction.tsx
import React from 'react'
import type {DocumentActionComponent} from 'sanity'

export const GenerateAiContentAction: DocumentActionComponent = (props) => {
  // Only show for products
  if (props.type !== 'product') return null

  const [isRunning, setIsRunning] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  return {
    label: isRunning ? 'Generating…' : 'Generate AI content',
    disabled: isRunning,
    onHandle: async () => {
      setIsRunning(true)
      setErrorMessage(null)

      try {
        // TODO: replace with your actual backend URL/route
        const res = await fetch('/api/enrich-product', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({documentId: props.id}),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Request failed with ${res.status}`)
        }

        // Optionally show a toast/notification here, if you use one

        // Let Studio know the action is done so it can re-fetch
        props.onComplete()
      } catch (err: any) {
        console.error('Generate AI content failed', err)
        setErrorMessage(err?.message || 'Unknown error')
        // Optionally show error in a dialog or toast; for now just complete
        props.onComplete()
      } finally {
        setIsRunning(false)
      }
    },
  }
}


Notes for Cursor:

This code does not include any tokens or secrets, only calls our backend.

props.id is the current document’s ID (draft or published), which our backend can handle appropriately.

It follows the documented pattern for document actions: returning { label, onHandle, disabled, ... }. 
Sanity.io
+1

3. Register the action in sanity.config.(ts|js)

We must add this custom action to document.actions so it appears in the document editor for product docs.

Sanity docs show two ways: static array or callback. We want the callback so we only add it for products. 
Sanity.io

Import the action into sanity.config.ts (or your workspace config file):

import {GenerateAiContentAction} from './studio/actions/generateAiContentAction'


In the defineConfig call, add / extend the document config:

export default defineConfig({
  // ...existing config...
  document: {
    actions: (prev, context) => {
      // Only add our custom action for product documents
      if (context.schemaType === 'product') {
        return [GenerateAiContentAction, ...prev]
      }
      return prev
    },
  },
})


This is directly in line with the examples in the “Document actions” docs (using the actions: (prev, context) => ... pattern). 
Sanity.io
+1

4. UX details & assumptions

Please also make sure that:

The action appears in the actions menu / footer of the product document editor as “Generate AI content”.

If the document has unsaved changes, it’s okay to:

Either rely on the user to click Publish / Save first, or

Optionally show a small dialog saying “Please save/publish before generating AI content” (not required, but nice).

After the backend finishes and props.onComplete() is called, the fresh values (seoTitle, seoDescription, etc.) should be visible in the form.