import type { CraftWork } from "../types/work";

export interface WorkFilter {
  keyword: string;
  type: string;
  difficulty: string;
  sort: "latest" | "hot";
  collectionFolder: string;
}

export function filterWorks(works: CraftWork[], filter: WorkFilter) {
  return works.filter((work) => {
    const textMatch = `${work.title} ${work.description}`.toLowerCase().includes(filter.keyword.toLowerCase());
    const typeMatch = filter.type === "all" || work.type === filter.type;
    const diffMatch = filter.difficulty === "all" || work.difficulty === filter.difficulty;
    let folderMatch = true;
    if (filter.collectionFolder === "collected") {
      folderMatch = work.collectionIds.length > 0;
    } else if (filter.collectionFolder === "uncollected") {
      folderMatch = work.collectionIds.length === 0;
    } else if (filter.collectionFolder !== "all") {
      folderMatch = work.collectionIds.includes(filter.collectionFolder);
    }
    return textMatch && typeMatch && diffMatch && folderMatch;
  }).sort((a, b) => filter.sort === "hot" ? b.likes - a.likes : b.createdAt.localeCompare(a.createdAt));
}
