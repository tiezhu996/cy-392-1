import type { CollectionFolder, CraftWork } from "../types/work";

const DB_NAME = "craft-gallery-db";
const WORKS_STORE = "works";
const FOLDERS_STORE = "folders";
const DB_VERSION = 2;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(WORKS_STORE)) {
        db.createObjectStore(WORKS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(FOLDERS_STORE)) {
        db.createObjectStore(FOLDERS_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function readWorks(): Promise<CraftWork[]> {
  const db = await openDb();
  return new Promise((resolve) => {
    const req = db.transaction(WORKS_STORE).objectStore(WORKS_STORE).getAll();
    req.onsuccess = () => resolve(req.result as CraftWork[]);
  });
}

export async function writeWorks(works: CraftWork[]) {
  const db = await openDb();
  const tx = db.transaction(WORKS_STORE, "readwrite");
  tx.objectStore(WORKS_STORE).clear();
  works.forEach((work) => tx.objectStore(WORKS_STORE).put(work));
}

export async function readFolders(): Promise<CollectionFolder[]> {
  const db = await openDb();
  return new Promise((resolve) => {
    const req = db.transaction(FOLDERS_STORE).objectStore(FOLDERS_STORE).getAll();
    req.onsuccess = () => resolve(req.result as CollectionFolder[]);
  });
}

export async function writeFolders(folders: CollectionFolder[]) {
  const db = await openDb();
  const tx = db.transaction(FOLDERS_STORE, "readwrite");
  tx.objectStore(FOLDERS_STORE).clear();
  folders.forEach((folder) => tx.objectStore(FOLDERS_STORE).put(folder));
}
