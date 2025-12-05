import { Question, User, Achievement, XP_REWARDS, XP_PER_LEVEL, Difficulty } from "@/types";

const QUESTIONS_KEY = "dsa_questions";
const USER_KEY = "dsa_user";
const ACHIEVEMENTS_KEY = "dsa_achievements";

// Sample data
const sampleQuestions: Question[] = [
  {
    id: "1",
    title: "Two Sum",
    link: "https://leetcode.com/problems/two-sum/",
    topic: "Arrays",
    difficulty: "Easy",
    solved: true,
    notes: "Use a hashmap to store complements for O(n) solution.",
    solvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "2",
    title: "Add Two Numbers",
    link: "https://leetcode.com/problems/add-two-numbers/",
    topic: "Linked Lists",
    difficulty: "Medium",
    solved: true,
    notes: "Iterate through both lists, handle carry over.",
    solvedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    topic: "Strings",
    difficulty: "Medium",
    solved: false,
    notes: "",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "4",
    title: "Median of Two Sorted Arrays",
    link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    topic: "Arrays",
    difficulty: "Hard",
    solved: false,
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Valid Parentheses",
    link: "https://leetcode.com/problems/valid-parentheses/",
    topic: "Stacks",
    difficulty: "Easy",
    solved: true,
    notes: "Use a stack to match opening and closing brackets.",
    solvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "6",
    title: "Merge Two Sorted Lists",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
    topic: "Linked Lists",
    difficulty: "Easy",
    solved: true,
    notes: "Create a dummy node, iterate through both lists.",
    solvedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "7",
    title: "Binary Tree Inorder Traversal",
    link: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    topic: "Trees",
    difficulty: "Easy",
    solved: true,
    notes: "Left -> Root -> Right, can use recursion or iterative with stack.",
    solvedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "8",
    title: "Maximum Depth of Binary Tree",
    link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    topic: "Trees",
    difficulty: "Easy",
    solved: false,
    notes: "",
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "9",
    title: "Coin Change",
    link: "https://leetcode.com/problems/coin-change/",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    solved: false,
    notes: "",
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "10",
    title: "Number of Islands",
    link: "https://leetcode.com/problems/number-of-islands/",
    topic: "Graphs",
    difficulty: "Medium",
    solved: false,
    notes: "",
    createdAt: new Date(Date.now() - 691200000).toISOString(),
  },
];

const defaultUser: User = {
  xp: 90, // 3 easy (30) + 2 medium (40) + 1 easy (10) + 1 easy (10) = 90
  level: 0,
  streak: 2,
  lastSolvedDate: new Date().toISOString().split("T")[0],
  totalSolved: 6,
};

const defaultAchievements: Achievement[] = [
  {
    id: "first_solve",
    name: "First Blood",
    description: "Solve your first question",
    icon: "🎯",
    unlockedAt: new Date(Date.now() - 345600000).toISOString(),
    requirement: "1 solve",
  },
  {
    id: "ten_solved",
    name: "Getting Started",
    description: "Solve 10 questions",
    icon: "🔟",
    unlockedAt: null,
    requirement: "10 solves",
  },
  {
    id: "fifty_solved",
    name: "Grinder",
    description: "Solve 50 questions",
    icon: "💪",
    unlockedAt: null,
    requirement: "50 solves",
  },
  {
    id: "topic_mastery",
    name: "Topic Master",
    description: "Solve 5 questions in one topic",
    icon: "🏆",
    unlockedAt: null,
    requirement: "5 in one topic",
  },
  {
    id: "streak_beast",
    name: "Streak Beast",
    description: "Maintain a 7-day solving streak",
    icon: "🔥",
    unlockedAt: null,
    requirement: "7-day streak",
  },
  {
    id: "hard_solver",
    name: "Hard Mode",
    description: "Solve your first hard question",
    icon: "💀",
    unlockedAt: null,
    requirement: "1 hard solve",
  },
  {
    id: "level_up",
    name: "Level Up!",
    description: "Reach level 1",
    icon: "⬆️",
    unlockedAt: null,
    requirement: "200 XP",
  },
];

// Initialize storage with sample data
export function initializeStorage() {
  if (!localStorage.getItem(QUESTIONS_KEY)) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(sampleQuestions));
  }
  if (!localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
  }
  if (!localStorage.getItem(ACHIEVEMENTS_KEY)) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
  }
}

// Questions CRUD
export function getQuestions(): Question[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
}

export function getQuestion(id: string): Question | undefined {
  const questions = getQuestions();
  return questions.find((q) => q.id === id);
}

export function addQuestion(question: Omit<Question, "id" | "createdAt">): Question {
  const questions = getQuestions();
  const newQuestion: Question = {
    ...question,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  questions.push(newQuestion);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  return newQuestion;
}

export function updateQuestion(id: string, updates: Partial<Question>): Question | undefined {
  const questions = getQuestions();
  const index = questions.findIndex((q) => q.id === id);
  if (index === -1) return undefined;

  questions[index] = { ...questions[index], ...updates };
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  return questions[index];
}

export function deleteQuestion(id: string): boolean {
  const questions = getQuestions();
  const filtered = questions.filter((q) => q.id !== id);
  if (filtered.length === questions.length) return false;
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filtered));
  return true;
}

// User data
export function getUser(): User {
  initializeStorage();
  return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
}

export function updateUser(updates: Partial<User>): User {
  const user = getUser();
  const updated = { ...user, ...updates };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

// Achievements
export function getAchievements(): Achievement[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || "[]");
}

export function unlockAchievement(id: string): Achievement | undefined {
  const achievements = getAchievements();
  const achievement = achievements.find((a) => a.id === id);
  if (achievement && !achievement.unlockedAt) {
    achievement.unlockedAt = new Date().toISOString();
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    return achievement;
  }
  return undefined;
}

// Topics
export function getTopics(): string[] {
  const questions = getQuestions();
  const topics = new Set(questions.map((q) => q.topic));
  return Array.from(topics).sort();
}

// Solve question and handle gamification
export interface SolveResult {
  xpGained: number;
  newLevel: number;
  leveledUp: boolean;
  newStreak: number;
  streakUpdated: boolean;
  newAchievements: Achievement[];
}

export function solveQuestion(id: string): SolveResult | null {
  const question = getQuestion(id);
  if (!question || question.solved) return null;

  const user = getUser();
  const questions = getQuestions();
  const today = new Date().toISOString().split("T")[0];

  // Mark question as solved
  updateQuestion(id, { solved: true, solvedAt: new Date().toISOString() });

  // Calculate XP
  const xpGained = XP_REWARDS[question.difficulty];
  const newXP = user.xp + xpGained;
  const newLevel = Math.floor(newXP / XP_PER_LEVEL);
  const leveledUp = newLevel > user.level;

  // Update streak
  let newStreak = user.streak;
  let streakUpdated = false;
  const lastSolved = user.lastSolvedDate;

  if (lastSolved !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (lastSolved === yesterday) {
      newStreak = user.streak + 1;
      streakUpdated = true;
    } else if (lastSolved !== today) {
      newStreak = 1;
      streakUpdated = user.streak !== 1;
    }
  }

  // Update user
  updateUser({
    xp: newXP,
    level: newLevel,
    streak: newStreak,
    lastSolvedDate: today,
    totalSolved: user.totalSolved + 1,
  });

  // Check achievements
  const newAchievements: Achievement[] = [];
  const updatedUser = getUser();
  const updatedQuestions = getQuestions();

  // First Solve
  if (updatedUser.totalSolved === 1) {
    const unlocked = unlockAchievement("first_solve");
    if (unlocked) newAchievements.push(unlocked);
  }

  // 10 Solved
  if (updatedUser.totalSolved >= 10) {
    const unlocked = unlockAchievement("ten_solved");
    if (unlocked) newAchievements.push(unlocked);
  }

  // 50 Solved
  if (updatedUser.totalSolved >= 50) {
    const unlocked = unlockAchievement("fifty_solved");
    if (unlocked) newAchievements.push(unlocked);
  }

  // Topic Mastery (5 in one topic)
  const topicCounts: Record<string, number> = {};
  updatedQuestions
    .filter((q) => q.solved)
    .forEach((q) => {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    });
  if (Object.values(topicCounts).some((count) => count >= 5)) {
    const unlocked = unlockAchievement("topic_mastery");
    if (unlocked) newAchievements.push(unlocked);
  }

  // Streak Beast (7-day streak)
  if (newStreak >= 7) {
    const unlocked = unlockAchievement("streak_beast");
    if (unlocked) newAchievements.push(unlocked);
  }

  // Hard Solver
  if (question.difficulty === "Hard") {
    const unlocked = unlockAchievement("hard_solver");
    if (unlocked) newAchievements.push(unlocked);
  }

  // Level Up achievement
  if (leveledUp && newLevel >= 1) {
    const unlocked = unlockAchievement("level_up");
    if (unlocked) newAchievements.push(unlocked);
  }

  return {
    xpGained,
    newLevel,
    leveledUp,
    newStreak,
    streakUpdated,
    newAchievements,
  };
}

// Reset all data
export function resetData() {
  localStorage.removeItem(QUESTIONS_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
  initializeStorage();
}
