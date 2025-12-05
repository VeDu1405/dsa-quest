export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  title: string;
  link: string;
  topic: string;
  difficulty: Difficulty;
  solved: boolean;
  notes: string;
  solvedAt?: string;
  createdAt: string;
}

export interface User {
  xp: number;
  level: number;
  streak: number;
  lastSolvedDate: string | null;
  totalSolved: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: string;
}

export interface XPReward {
  Easy: number;
  Medium: number;
  Hard: number;
}

export const XP_REWARDS: XPReward = {
  Easy: 10,
  Medium: 20,
  Hard: 40,
};

export const XP_PER_LEVEL = 200;
