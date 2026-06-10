import type { CraftWork } from "../types/work";

const DB_NAME = "craft-gallery-db";
const STORE = "works";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function readWorks(): Promise<CraftWork[]> {
  const db = await openDb();
  return new Promise((resolve) => {
    const req = db.transaction(STORE).objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as CraftWork[]);
  });
}

export async function writeWorks(works: CraftWork[]) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).clear();
  works.forEach((work) => tx.objectStore(STORE).put(work));
}
