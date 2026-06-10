import type { CraftWork } from "../types/work";

const author = { id: "a-1", name: "林木手作", bio: "喜欢把日常材料变成温暖物件。", followed: false };

export const mockWorks: CraftWork[] = Array.from({ length: 18 }).map((_, index) => ({
  id: `work-${index + 1}`,
  title: ["羊毛杯垫", "樱桃木托盘", "陶土花器", "植鞣革卡包", "纸雕灯罩", "刺绣胸针"][index % 6],
  type: ["knit", "wood", "pottery", "leather", "paper", "embroidery"][index % 6] as CraftWork["type"],
  difficulty: ["beginner", "intermediate", "advanced"][index % 3] as CraftWork["difficulty"],
  materials: ["棉线", "木蜡油", "手缝针", "环保胶"].slice(0, (index % 4) + 1),
  durationHours: 2 + index,
  images: [`https://picsum.photos/seed/craft-${index}/520/${620 + (index % 5) * 90}`, `https://picsum.photos/seed/craft-extra-${index}/520/620`],
  description: "适合周末完成的手工作品，材料易得，步骤清晰，成品可以自用或送礼。",
  steps: ["准备材料并裁切", "按教程组装主体", "打磨边缘并整理细节", "拍照记录成品"],
  tutorialUrl: "https://example.com/tutorial",
  author,
  likes: 12 + index * 3,
  collected: index % 5 === 0,
  createdAt: new Date(Date.now() - index * 86400000).toISOString()
}));
