import fs from "fs";
import path from "path";

const DEFAULT_FILE = path.join(process.cwd(), ".sanity-sync-checkpoint.json");

export function readCheckpoint(file = DEFAULT_FILE): string | undefined {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const json = JSON.parse(raw);
    return json?.lastSyncedAt as string | undefined;
  } catch {
    return undefined;
  }
}

export function writeCheckpoint(ts: string, file = DEFAULT_FILE) {
  const payload = { lastSyncedAt: ts };
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
}




