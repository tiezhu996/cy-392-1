export const CRAFT_TYPES = [
  { label: "全部", value: "all" },
  { label: "编织", value: "knit" },
  { label: "木工", value: "wood" },
  { label: "陶艺", value: "pottery" },
  { label: "皮具", value: "leather" },
  { label: "纸艺", value: "paper" },
  { label: "刺绣", value: "embroidery" },
  { label: "其他", value: "other" }
] as const;

export const DIFFICULTIES = [
  { label: "全部", value: "all" },
  { label: "入门", value: "beginner" },
  { label: "进阶", value: "intermediate" },
  { label: "高级", value: "advanced" }
] as const;
