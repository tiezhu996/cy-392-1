import type { CraftWork } from "../types/work";

export interface WorkFilter {
  keyword: string;
  type: string;
  difficulty: string;
  sort: "latest" | "hot";
  onlyCollected: boolean;
}

export function filterWorks(works: CraftWork[], filter: WorkFilter) {
  return works.filter((work) => {
    const textMatch = `${work.title} ${work.description}`.toLowerCase().includes(filter.keyword.toLowerCase());
    const typeMatch = filter.type === "all" || work.type === filter.type;
    const diffMatch = filter.difficulty === "all" || work.difficulty === filter.difficulty;
    const collectMatch = !filter.onlyCollected || work.collected;
    return textMatch && typeMatch && diffMatch && collectMatch;
  }).sort((a, b) => filter.sort === "hot" ? b.likes - a.likes : b.createdAt.localeCompare(a.createdAt));
}
