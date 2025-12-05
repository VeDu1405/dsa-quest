import { useState, useEffect } from "react";
import { Flame, Zap, Award, Trophy } from "lucide-react";
import { getUser, getAchievements } from "@/lib/storage";
import { XP_PER_LEVEL } from "@/types";
import { User, Achievement } from "@/types";
import { cn } from "@/lib/utils";

export function GamificationPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const loadData = () => {
      setUser(getUser());
      setAchievements(getAchievements());
    };
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("questionsUpdated", handleUpdate);
    return () => window.removeEventListener("questionsUpdated", handleUpdate);
  }, []);

  if (!user) return null;

  const xpInCurrentLevel = user.xp % XP_PER_LEVEL;
  const xpProgress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <aside className="w-72 border-l border-border bg-sidebar p-4 overflow-y-auto">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        $ ./stats
      </div>

      {/* Level & XP */}
      <div className="terminal-card mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-foreground" />
            <span className="text-sm text-muted-foreground">Level</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{user.level}</span>
        </div>
        
        <div className="xp-bar mb-2">
          <div
            className="xp-bar-fill"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{xpInCurrentLevel} XP</span>
          <span>{XP_PER_LEVEL} XP</span>
        </div>
        
        <div className="mt-2 text-center text-sm">
          <span className="text-foreground">{user.xp}</span>
          <span className="text-muted-foreground"> total XP</span>
        </div>
      </div>

      {/* Streak */}
      <div className="terminal-card mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={cn(
              "w-5 h-5",
              user.streak >= 3 ? "text-foreground" : "text-muted-foreground"
            )} />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-foreground">
              {user.streak}
            </span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          {user.lastSolvedDate === new Date().toISOString().split("T")[0] ? (
            <span className="text-foreground">✓ Solved today!</span>
          ) : (
            <span>Solve a question to keep your streak!</span>
          )}
        </div>
      </div>

      {/* Solved Counter */}
      <div className="terminal-card mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-foreground" />
            <span className="text-sm text-muted-foreground">Solved</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{user.totalSolved}</span>
        </div>
      </div>

      {/* Achievements */}
      <div className="terminal-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-foreground" />
            <span className="text-sm text-muted-foreground">Achievements</span>
          </div>
          <span className="text-xs text-foreground">{unlockedCount}/{achievements.length}</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "aspect-square flex items-center justify-center rounded-sm text-lg border transition-all",
                achievement.unlockedAt
                  ? "bg-foreground/10 border-foreground/50"
                  : "bg-muted/50 border-border opacity-40 grayscale"
              )}
              title={`${achievement.name}: ${achievement.description}`}
            >
              {achievement.icon}
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          {achievements.filter((a) => !a.unlockedAt).length > 0 && (
            <div className="space-y-1">
              <div className="text-foreground">Next achievement:</div>
              {(() => {
                const next = achievements.find((a) => !a.unlockedAt);
                return next ? (
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">{next.icon}</span>
                    <span>{next.name}</span>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </div>

      {/* XP Guide */}
      <div className="mt-4 text-xs text-muted-foreground">
        <div className="text-foreground mb-1">XP rewards:</div>
        <div className="flex justify-between">
          <span className="badge-easy px-2 py-0.5 rounded-sm">Easy +10</span>
          <span className="badge-medium px-2 py-0.5 rounded-sm">Medium +20</span>
          <span className="badge-hard px-2 py-0.5 rounded-sm">Hard +40</span>
        </div>
      </div>
    </aside>
  );
}
