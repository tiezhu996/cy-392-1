import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useWorkStore } from "../stores/workStore";
import type { CollectionFolder, CraftWork } from "../types/work";

const dbState = { works: [] as CraftWork[], folders: [] as CollectionFolder[] };

vi.mock("../storage/indexedDb", () => ({
  readWorks: () => Promise.resolve(dbState.works),
  writeWorks: (ws: CraftWork[]) => Promise.resolve((dbState.works = ws)),
  readFolders: () => Promise.resolve(dbState.folders),
  writeFolders: (fs: CollectionFolder[]) => Promise.resolve((dbState.folders = fs)),
}));

vi.mock("../mock/works", () => ({
  mockWorks: Array.from({ length: 3 }).map((_, i) => ({
    id: `mock-${i + 1}`,
    title: `Mock Work ${i + 1}`,
    type: "other" as const,
    difficulty: "beginner" as const,
    materials: [],
    durationHours: 1,
    images: [],
    description: "",
    steps: [],
    author: { id: "a", name: "", bio: "", followed: false },
    likes: 0,
    collectionIds: i === 0 ? ["folder-default"] : [],
    createdAt: new Date().toISOString(),
  })),
}));

function makeWork(id: string, collectionIds: string[] = []): CraftWork {
  return {
    id,
    title: `Work ${id}`,
    type: "other",
    difficulty: "beginner",
    materials: [],
    durationHours: 1,
    images: [],
    description: "",
    steps: [],
    author: { id: "a", name: "", bio: "", followed: false },
    likes: 0,
    collectionIds,
    createdAt: new Date().toISOString(),
  };
}

describe("useWorkStore 收藏夹与收藏逻辑", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    dbState.works = [];
    dbState.folders = [];
    let seq = 0;
    vi.spyOn(crypto, "randomUUID").mockImplementation(() => `00000000-0000-4000-8000-${String(++seq).padStart(12, "0")}` as ReturnType<typeof crypto.randomUUID>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hydrate 时若无任何数据，则创建默认收藏夹和 mockWorks", async () => {
    const store = useWorkStore();
    await store.hydrate();
    expect(store.folders).toHaveLength(1);
    expect(store.folders[0].name).toBe("默认收藏");
    expect(store.works).toHaveLength(3);
    expect(store.works[0].collectionIds).toEqual(["folder-default"]);
  });

  it("addFolder 可新建收藏夹并持久化", async () => {
    const store = useWorkStore();
    await store.hydrate();
    const before = store.folders.length;
    const folder = store.addFolder("编织灵感");
    expect(folder.name).toBe("编织灵感");
    expect(store.folders).toHaveLength(before + 1);
    expect(store.folders.map((f) => f.name)).toContain("编织灵感");
  });

  it("renameFolder 可修改收藏夹名称", async () => {
    const store = useWorkStore();
    await store.hydrate();
    const folder = store.addFolder("原名");
    store.renameFolder(folder.id, "新名字");
    expect(store.folders.find((f) => f.id === folder.id)?.name).toBe("新名字");
  });

  it("removeFolder 删除收藏夹时，所有作品的对应 collectionIds 也被清除", async () => {
    const store = useWorkStore();
    await store.hydrate();
    const folder = store.addFolder("待删除");
    store.addToCollection("mock-1", folder.id);
    store.addToCollection("mock-2", folder.id);
    expect(store.works.find((w) => w.id === "mock-1")!.collectionIds).toContain(folder.id);
    expect(store.works.find((w) => w.id === "mock-2")!.collectionIds).toContain(folder.id);

    store.removeFolder(folder.id);

    expect(store.folders.map((f) => f.id)).not.toContain(folder.id);
    expect(store.works.find((w) => w.id === "mock-1")!.collectionIds).not.toContain(folder.id);
    expect(store.works.find((w) => w.id === "mock-2")!.collectionIds).not.toContain(folder.id);
  });

  it("addToCollection 可将作品加入多个收藏夹，不重复添加", async () => {
    const store = useWorkStore();
    await store.hydrate();
    const fa = store.addFolder("A");
    const fb = store.addFolder("B");
    expect(fa.id).not.toBe(fb.id);
    store.addToCollection("mock-2", fa.id);
    store.addToCollection("mock-2", fa.id);
    store.addToCollection("mock-2", fb.id);
    const work = store.works.find((w) => w.id === "mock-2")!;
    expect(work.collectionIds).toContain(fa.id);
    expect(work.collectionIds).toContain(fb.id);
    expect(work.collectionIds).toHaveLength(2);
  });

  it("removeFromCollection 只从指定收藏夹移除，其他夹保持不变", async () => {
    const store = useWorkStore();
    await store.hydrate();
    const fa = store.addFolder("A");
    const fb = store.addFolder("B");
    store.addToCollection("mock-2", fa.id);
    store.addToCollection("mock-2", fb.id);
    store.removeFromCollection("mock-2", fa.id);
    const work = store.works.find((w) => w.id === "mock-2")!;
    expect(work.collectionIds).not.toContain(fa.id);
    expect(work.collectionIds).toContain(fb.id);
  });

  it("hydrate 会将旧数据 collected:true 迁移到 collectionIds 中默认收藏夹", async () => {
    const oldWork1 = { ...makeWork("old-1"), collected: true } as unknown as CraftWork;
    const oldWork2 = { ...makeWork("old-2"), collected: false } as unknown as CraftWork;
    delete (oldWork1 as Partial<CraftWork>).collectionIds;
    delete (oldWork2 as Partial<CraftWork>).collectionIds;
    dbState.works = [oldWork1, oldWork2];

    const store = useWorkStore();
    await store.hydrate();

    const w1 = store.works.find((w) => w.id === "old-1");
    const w2 = store.works.find((w) => w.id === "old-2");
    expect(w1).toBeDefined();
    expect(w2).toBeDefined();
    expect(w1!.collectionIds).toContain("folder-default");
    expect(w2!.collectionIds).toEqual([]);
  });

  it("like 会累加点赞数", async () => {
    const store = useWorkStore();
    await store.hydrate();
    const before = store.works[0].likes;
    store.like(store.works[0].id);
    expect(store.works[0].likes).toBe(before + 1);
  });

  it("displayed 会根据 filter.collectionFolder 动态过滤", async () => {
    const store = useWorkStore();
    await store.hydrate();
    expect(store.displayed).toHaveLength(store.works.length);

    store.filter.collectionFolder = "collected";
    expect(store.displayed.every((w) => w.collectionIds.length > 0)).toBe(true);

    store.filter.collectionFolder = "uncollected";
    expect(store.displayed.every((w) => w.collectionIds.length === 0)).toBe(true);

    store.filter.collectionFolder = "folder-default";
    expect(store.displayed.every((w) => w.collectionIds.includes("folder-default"))).toBe(true);
  });
});
