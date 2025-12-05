import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { Question, Difficulty } from "@/types";
import { addQuestion, updateQuestion, getTopics } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface QuestionFormProps {
  question?: Question;
  onSave?: () => void;
}

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

const difficultyClass: Record<Difficulty, string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export function QuestionForm({ question, onSave }: QuestionFormProps) {
  const navigate = useNavigate();
  const [existingTopics, setExistingTopics] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: question?.title || "",
    link: question?.link || "",
    topic: question?.topic || "",
    difficulty: question?.difficulty || "Easy" as Difficulty,
    notes: question?.notes || "",
    solved: question?.solved || false,
  });
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);

  useEffect(() => {
    setExistingTopics(getTopics());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (question) {
      updateQuestion(question.id, formData);
    } else {
      addQuestion(formData);
    }
    
    window.dispatchEvent(new Event("questionsUpdated"));
    
    if (onSave) {
      onSave();
    } else {
      navigate("/");
    }
  };

  const filteredTopics = existingTopics.filter((t) =>
    t.toLowerCase().includes(formData.topic.toLowerCase()) && t !== formData.topic
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          <span className="text-secondary">$</span> title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Two Sum"
          required
          className="terminal-input w-full"
        />
      </div>

      {/* Link */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          <span className="text-secondary">$</span> link
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://leetcode.com/problems/two-sum/"
          required
          className="terminal-input w-full"
        />
      </div>

      {/* Topic */}
      <div className="relative">
        <label className="block text-sm text-muted-foreground mb-2">
          <span className="text-secondary">$</span> topic
        </label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          onFocus={() => setShowTopicSuggestions(true)}
          onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 200)}
          placeholder="Arrays, Trees, Dynamic Programming..."
          required
          className="terminal-input w-full"
        />
        
        {/* Topic suggestions */}
        {showTopicSuggestions && filteredTopics.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-sm shadow-lg">
            {filteredTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, topic });
                  setShowTopicSuggestions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          <span className="text-secondary">$</span> difficulty
        </label>
        <div className="flex gap-3">
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setFormData({ ...formData, difficulty: diff })}
              className={cn(
                "px-4 py-2 rounded-sm text-sm border transition-all",
                formData.difficulty === diff
                  ? cn(difficultyClass[diff], "ring-1 ring-offset-1 ring-offset-background")
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">
          <span className="text-secondary">$</span> notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Solution approach, time complexity, key insights..."
          rows={4}
          className="terminal-input w-full resize-none"
        />
      </div>

      {/* Solved toggle (only for editing) */}
      {question && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, solved: !formData.solved })}
            className={cn(
              "w-5 h-5 rounded-sm border transition-all flex items-center justify-center",
              formData.solved
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border hover:border-primary"
            )}
          >
            {formData.solved && "✓"}
          </button>
          <span className="text-sm text-muted-foreground">Mark as solved</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button type="submit" className="terminal-btn flex items-center gap-2">
          <Save className="w-4 h-4" />
          <span>{question ? "Update" : "Add"} Question</span>
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="terminal-btn-secondary flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );
}
