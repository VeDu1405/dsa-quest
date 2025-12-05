import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Edit, Trash2, CheckCircle, Circle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { QuestionForm } from "@/components/QuestionForm";
import { XPGainAnimation } from "@/components/XPGainAnimation";
import { AchievementModal } from "@/components/AchievementModal";
import { getQuestion, deleteQuestion, solveQuestion } from "@/lib/storage";
import { Question, Achievement, Difficulty } from "@/types";
import { cn } from "@/lib/utils";

const difficultyClass: Record<Difficulty, string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (id) {
      const q = getQuestion(id);
      if (q) {
        setQuestion(q);
      } else {
        navigate("/");
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (question && confirm("Delete this question?")) {
      deleteQuestion(question.id);
      window.dispatchEvent(new Event("questionsUpdated"));
      navigate("/");
    }
  };

  const handleSolve = () => {
    if (!question || question.solved) return;
    
    const result = solveQuestion(question.id);
    if (result) {
      setXpGain(result.xpGained);
      setTimeout(() => setXpGain(null), 1500);
      
      if (result.newAchievements.length > 0) {
        setTimeout(() => {
          setNewAchievement(result.newAchievements[0]);
        }, 500);
      }
      
      setQuestion(getQuestion(question.id) || null);
      window.dispatchEvent(new Event("questionsUpdated"));
    }
  };

  const handleSave = () => {
    if (id) {
      setQuestion(getQuestion(id) || null);
      setIsEditing(false);
    }
  };

  if (!question) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto relative">
        {/* XP Animation */}
        <AnimatePresence>
          {xpGain && <XPGainAnimation xp={xpGain} />}
        </AnimatePresence>

        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="terminal-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary glow-text-cyan">
                Edit Question
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
            <QuestionForm question={question} onSave={handleSave} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="terminal-card"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={handleSolve}
                    disabled={question.solved}
                    className={cn(
                      "transition-all",
                      question.solved
                        ? "text-primary cursor-default"
                        : "text-muted-foreground hover:text-primary hover:scale-110"
                    )}
                  >
                    {question.solved ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <h2 className={cn(
                    "text-2xl font-bold",
                    question.solved ? "text-primary glow-text-green" : "text-foreground"
                  )}>
                    {question.title}
                  </h2>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{question.topic}</span>
                  <span className={cn("px-2 py-0.5 rounded-sm text-xs", difficultyClass[question.difficulty])}>
                    {question.difficulty}
                  </span>
                  {question.solved && (
                    <span className="text-primary text-xs">
                      ✓ Solved
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-btn-secondary p-2"
                  title="Open problem"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsEditing(true)}
                  className="terminal-btn-secondary p-2"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="terminal-btn-danger p-2"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Link */}
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-1">
                <span className="text-secondary">$</span> link
              </div>
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline break-all"
              >
                {question.link}
              </a>
            </div>

            {/* Notes */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">
                <span className="text-secondary">$</span> notes
              </div>
              {question.notes ? (
                <div className="p-4 bg-muted/50 rounded-sm border border-border whitespace-pre-wrap">
                  {question.notes}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  No notes yet. Click edit to add some.
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground flex gap-6">
              <div>
                <span className="text-secondary">created:</span>{" "}
                {new Date(question.createdAt).toLocaleString()}
              </div>
              {question.solvedAt && (
                <div>
                  <span className="text-primary">solved:</span>{" "}
                  {new Date(question.solvedAt).toLocaleString()}
                </div>
              )}
            </div>

            {/* Solve button */}
            {!question.solved && (
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={handleSolve}
                  className="terminal-btn w-full flex items-center justify-center gap-2 py-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark as Solved</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
    </Layout>
  );
}
