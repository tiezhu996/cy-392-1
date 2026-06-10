export type CraftType = "knit" | "wood" | "pottery" | "leather" | "paper" | "embroidery" | "other";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Author {
  id: string;
  name: string;
  bio: string;
  followed: boolean;
}

export interface CraftWork {
  id: string;
  title: string;
  type: CraftType;
  difficulty: Difficulty;
  materials: string[];
  durationHours: number;
  images: string[];
  description: string;
  steps: string[];
  tutorialUrl?: string;
  author: Author;
  likes: number;
  collected: boolean;
  createdAt: string;
}
