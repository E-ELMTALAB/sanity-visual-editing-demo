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

  const baseQuery = `${DEFAULT_GROQ} | order(_updatedAt asc) ${since ? `| [_updatedAt > $since]` : ''}`;
  log(`Fetching products${since ? ` since ${since}` : " (full)"}...`);
  const docs: SanityProduct[] = await client.fetch(baseQuery, since ? { since } : {});

  if (!docs?.length) {
    log("No products from Sanity.");
    return;
  }

  let created = 0;
  let updated = 0;
  let failed = 0;
  let latestUpdatedAt = since;

  const concurrency = Number(process.env.SANITY_SYNC_CONCURRENCY || 5);
  const queue: Promise<void>[] = [];

  async function processDoc(doc: SanityProduct) {
    latestUpdatedAt = !latestUpdatedAt || doc._updatedAt > latestUpdatedAt ? doc._updatedAt : latestUpdatedAt;
    const body = mapSanityToUpsertBody(doc);
    if (dryRun) {
      log(`DRY-RUN upsert sanityId=${body.sanityId} handle=${body.handle} title="${body.title}"`);
      return;
    }
    try {
      const res = await upsertProductREST(body);
      if (!res.ok) {
        failed++;
        log(`FAIL sanityId=${body.sanityId}: ${res.error}`);
      } else if (res.isUpdate) {
        updated++;
        log(`UPDATED sanityId=${body.sanityId} productId=${res.productId ?? "unknown"}`);
      } else {
        created++;
        log(`CREATED sanityId=${body.sanityId} productId=${res.productId ?? "unknown"}`);
      }
    } catch (e: any) {
      failed++;
      log(`FAIL sanityId=${body.sanityId}: ${e?.message || e}`);
    }
  }

  for (const doc of docs) {
    const p = processDoc(doc);
    queue.push(p);
    if (queue.length >= concurrency) {
      await Promise.race(queue).catch(() => undefined);
      // prune settled promises
      for (let i = queue.length - 1; i >= 0; i--) {
        if (Reflect.get(queue[i] as any, 'settled')) {
          queue.splice(i, 1);
        }
      }
    }
  }
  await Promise.allSettled(queue);

  if (!dryRun && latestUpdatedAt) {
    writeCheckpoint(latestUpdatedAt);
  }

  log(`Done. updated=${updated} created=${created} failed=${failed}`);
}

main().catch((e) => {
  console.error("[sanitySync] fatal", e);
  process.exit(1);
});


