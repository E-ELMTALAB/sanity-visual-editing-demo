import { getSanityClient, DEFAULT_GROQ, SanityProduct } from "../lib/sanity-sync/sanityClient";
import { mapSanityToUpsertBody } from "../lib/sanity-sync/mapToMedusa";
import { upsertProductREST } from "../lib/sanity-sync/upsert";
import { readCheckpoint, writeCheckpoint } from "../lib/sanity-sync/checkpoint";

function log(msg: string) {
  console.log(`[sanitySync] ${msg}`);
}

async function main() {
  const dryRun = process.env.SANITY_SYNC_DRY_RUN === "true";
  const since = readCheckpoint();

  const client = getSanityClient();

  const baseQuery = DEFAULT_GROQ;
  log(`Fetching products${since ? ` since ${since}` : " (full)"}...`);
  const docs: SanityProduct[] = await client.fetch(baseQuery);

  if (!docs?.length) {
    log("No products from Sanity.");
    return;
  }

  let created = 0;
  let updated = 0;
  let failed = 0;
  let latestUpdatedAt = since;

  for (const doc of docs) {
    latestUpdatedAt = !latestUpdatedAt || doc._updatedAt > latestUpdatedAt ? doc._updatedAt : latestUpdatedAt;
    const body = mapSanityToUpsertBody(doc);
    if (dryRun) {
      log(`DRY-RUN upsert sanityId=${body.sanityId} handle=${body.handle}`);
      continue;
    }

    const res = await upsertProductREST(body);
    if (!res.ok) {
      failed++;
      log(`FAIL sanityId=${body.sanityId}: ${res.error}`);
    } else {
      // We can't distinguish create/update without a dedicated endpoint response; treat as updated
      updated++;
      log(`OK sanityId=${body.sanityId} productId=${res.productId ?? "unknown"}`);
    }
  }

  if (!dryRun && latestUpdatedAt) {
    writeCheckpoint(latestUpdatedAt);
  }

  log(`Done. updated=${updated} created=${created} failed=${failed}`);
}

main().catch((e) => {
  console.error("[sanitySync] fatal", e);
  process.exit(1);
});


