import { describe, it, expect } from "vitest";
import { filterWorks, type WorkFilter } from "../utils/filter";
import type { CraftWork } from "../types/work";

const baseFilter: WorkFilter = {
  keyword: "",
  type: "all",
  difficulty: "all",
  sort: "latest",
  collectionFolder: "all",
};

function makeWork(id: string, collectionIds: string[] = []): CraftWork {
  return {
    id,
    title: `作品${id}`,
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
    createdAt: `2024-01-${id.padStart(2, "0")}T00:00:00.000Z`,
  };
}

describe("filterWorks 收藏夹筛选", () => {
  const works = [
    makeWork("01", ["folder-a"]),
    makeWork("02", ["folder-b"]),
    makeWork("03", ["folder-a", "folder-b"]),
    makeWork("04", []),
    makeWork("05", ["folder-c"]),
  ];

  it('collectionFolder="all" 返回所有作品', () => {
    const result = filterWorks(works, { ...baseFilter, collectionFolder: "all" });
    expect(result).toHaveLength(5);
  });

  it('collectionFolder="collected" 返回 collectionIds 非空的作品', () => {
    const result = filterWorks(works, { ...baseFilter, collectionFolder: "collected" });
    expect(result.map((w) => w.id).sort()).toEqual(["01", "02", "03", "05"]);
  });

  it('collectionFolder="uncollected" 返回 collectionIds 为空的作品', () => {
    const result = filterWorks(works, { ...baseFilter, collectionFolder: "uncollected" });
    expect(result.map((w) => w.id)).toEqual(["04"]);
  });

  it('collectionFolder 指定具体 id，仅返回该夹中的作品（多夹重复作品也算）', () => {
    const resultA = filterWorks(works, { ...baseFilter, collectionFolder: "folder-a" });
    expect(resultA.map((w) => w.id).sort()).toEqual(["01", "03"]);

    const resultB = filterWorks(works, { ...baseFilter, collectionFolder: "folder-b" });
    expect(resultB.map((w) => w.id).sort()).toEqual(["02", "03"]);
  });

  it('收藏夹筛选与类型筛选可组合使用', () => {
    const typedWorks = [
      { ...makeWork("11", ["folder-a"]), type: "wood" as const },
      { ...makeWork("12", ["folder-a"]), type: "knit" as const },
      { ...makeWork("13", ["folder-b"]), type: "wood" as const },
    ];
    const result = filterWorks(typedWorks, { ...baseFilter, collectionFolder: "folder-a", type: "wood" });
    expect(result.map((w) => w.id)).toEqual(["11"]);
  });

  it('sort=hot 按 likes 降序，sort=latest 按 createdAt 降序', () => {
    const sortedWorks = [
      { ...makeWork("01"), likes: 10 },
      { ...makeWork("02"), likes: 30 },
      { ...makeWork("03"), likes: 20 },
    ];
    const hot = filterWorks(sortedWorks, { ...baseFilter, sort: "hot" });
    expect(hot.map((w) => w.id)).toEqual(["02", "03", "01"]);
    const latest = filterWorks(sortedWorks, { ...baseFilter, sort: "latest" });
    expect(latest.map((w) => w.id)).toEqual(["03", "02", "01"]);
  });
});
