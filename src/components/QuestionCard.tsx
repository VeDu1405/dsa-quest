import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, CheckCircle, Circle, Trash2, Edit } from "lucide-react";
import { Question, Difficulty } from "@/types";
import { solveQuestion, deleteQuestion, SolveResult } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { XPGainAnimation } from "./XPGainAnimation";
import { AchievementModal } from "./AchievementModal";
import { Achievement } from "@/types";

interface QuestionCardProps {
  question: Question;
  onUpdate: () => void;
}

const difficultyClass: Record<Difficulty, string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export function QuestionCard({ question, onUpdate }: QuestionCardProps) {
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSolve = () => {
    if (question.solved) return;
    
    const result = solveQuestion(question.id);
    if (result) {
      setXpGain(result.xpGained);
      setTimeout(() => setXpGain(null), 1500);
      
      if (result.newAchievements.length > 0) {
        setTimeout(() => {
          setNewAchievement(result.newAchievements[0]);
        }, 500);
      }
      
      window.dispatchEvent(new Event("questionsUpdated"));
      onUpdate();
    }
  };

  const handleDelete = () => {
    if (confirm("Delete this question?")) {
      setIsDeleting(true);
      setTimeout(() => {
        deleteQuestion(question.id);
        window.dispatchEvent(new Event("questionsUpdated"));
        onUpdate();
      }, 300);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isDeleting ? 0 : 1, y: isDeleting ? -20 : 0, scale: isDeleting ? 0.9 : 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "terminal-card-glow relative group",
          question.solved && "border-primary/30"
        )}
      >
        {/* XP Animation */}
        <AnimatePresence>
          {xpGain && <XPGainAnimation xp={xpGain} />}
        </AnimatePresence>

        <div className="flex items-start gap-4">
          {/* Solve button */}
          <button
            onClick={handleSolve}
            disabled={question.solved}
            className={cn(
              "mt-1 transition-all",
              question.solved
                ? "text-primary cursor-default"
                : "text-muted-foreground hover:text-primary hover:scale-110"
            )}
          >
            {question.solved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Link
                to={`/question/${question.id}`}
                className={cn(
                  "font-medium hover:text-primary transition-colors truncate",
                  question.solved ? "text-primary" : "text-foreground"
                )}
              >
                {question.title}
              </Link>
              
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">{question.topic}</span>
              <span className={cn("px-2 py-0.5 rounded-sm text-xs", difficultyClass[question.difficulty])}>
                {question.difficulty}
              </span>
              {question.solved && question.solvedAt && (
                <span className="text-xs text-muted-foreground">
                  Solved {new Date(question.solvedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {question.notes && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {question.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={`/question/${question.id}`}
              className="p-2 text-muted-foreground hover:text-secondary transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Solved indicator line */}
        {question.solved && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-sm" />
        )}
      </motion.div>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
    </>
  );
}
