import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { mockWorks } from "../mock/works";
import { readWorks, readFolders, writeWorks, writeFolders } from "../storage/indexedDb";
import type { CollectionFolder, CraftWork } from "../types/work";
import { filterWorks, type WorkFilter } from "../utils/filter";

const DEFAULT_FOLDERS: CollectionFolder[] = [
  { id: "folder-default", name: "默认收藏", createdAt: new Date().toISOString() },
];

export const useWorkStore = defineStore("works", () => {
  const works = ref<CraftWork[]>([]);
  const folders = ref<CollectionFolder[]>([]);
  const filter = ref<WorkFilter>({ keyword: "", type: "all", difficulty: "all", sort: "latest", collectionFolder: "all" });
  const selected = ref<CraftWork | null>(null);
  const displayed = computed(() => filterWorks(works.value, filter.value));

  async function hydrate() {
    const [savedWorks, savedFolders] = await Promise.all([readWorks(), readFolders()]);
    if (savedFolders.length) {
      folders.value = savedFolders;
    } else {
      folders.value = [...DEFAULT_FOLDERS];
      await writeFolders(folders.value);
    }
    if (savedWorks.length) {
      works.value = savedWorks.map((w) => ({
        ...w,
        collectionIds: (w as unknown as Record<string, unknown>).collected
          ? [folders.value[0]?.id ?? "folder-default"]
          : (w.collectionIds ?? []),
      }));
      await writeWorks(works.value);
    } else {
      works.value = mockWorks;
      await writeWorks(works.value);
    }
  }

  function persistWorks() { writeWorks(works.value); }
  function persistFolders() { writeFolders(folders.value); }

  function like(id: string) {
    const item = works.value.find((w) => w.id === id);
    if (item) item.likes += 1;
    persistWorks();
  }

  function addToCollection(workId: string, folderId: string) {
    const item = works.value.find((w) => w.id === workId);
    if (item && !item.collectionIds.includes(folderId)) {
      item.collectionIds.push(folderId);
      persistWorks();
    }
  }

  function removeFromCollection(workId: string, folderId: string) {
    const item = works.value.find((w) => w.id === workId);
    if (item) {
      item.collectionIds = item.collectionIds.filter((id) => id !== folderId);
      persistWorks();
    }
  }

  function addFolder(name: string) {
    const folder: CollectionFolder = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    folders.value.push(folder);
    persistFolders();
    return folder;
  }

  function removeFolder(folderId: string) {
    folders.value = folders.value.filter((f) => f.id !== folderId);
    works.value.forEach((w) => {
      w.collectionIds = w.collectionIds.filter((id) => id !== folderId);
    });
    persistFolders();
    persistWorks();
  }

  function renameFolder(folderId: string, name: string) {
    const folder = folders.value.find((f) => f.id === folderId);
    if (folder) folder.name = name;
    persistFolders();
  }

  function follow(authorId: string) {
    works.value.forEach((w) => {
      if (w.author.id === authorId) w.author.followed = !w.author.followed;
    });
    persistWorks();
  }

  function addWork(work: CraftWork) {
    works.value.unshift(work);
    persistWorks();
  }

  return {
    works, folders, filter, selected, displayed,
    hydrate, like, addToCollection, removeFromCollection,
    addFolder, removeFolder, renameFolder, follow, addWork,
  };
});
