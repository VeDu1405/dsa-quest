import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { getQuestions } from "@/lib/storage";
import { Question, Difficulty } from "@/types";
import { cn } from "@/lib/utils";

type SortField = "title" | "difficulty" | "createdAt";
type SortOrder = "asc" | "desc";

const difficultyOrder: Record<Difficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");

  const topic = searchParams.get("topic");
  const filter = searchParams.get("filter");

  const loadQuestions = () => {
    setQuestions(getQuestions());
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const filteredAndSortedQuestions = useMemo(() => {
    let result = [...questions];

    // Topic filter
    if (topic) {
      result = result.filter((q) => q.topic === topic);
    }

    // Solved/Unsolved filter
    if (filter === "solved") {
      result = result.filter((q) => q.solved);
    } else if (filter === "unsolved") {
      result = result.filter((q) => !q.solved);
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter((q) => q.difficulty === difficultyFilter);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.topic.toLowerCase().includes(query) ||
          q.notes.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === "difficulty") {
        comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else if (sortField === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [questions, topic, filter, difficultyFilter, searchQuery, sortField, sortOrder]);

  const getTitle = () => {
    if (topic) return topic;
    if (filter === "solved") return "Solved Questions";
    if (filter === "unsolved") return "Unsolved Questions";
    return "All Questions";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary glow-text-green">
              {getTitle()}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredAndSortedQuestions.length} questions
              {filteredAndSortedQuestions.filter((q) => q.solved).length > 0 && (
                <span className="text-primary">
                  {" "}
                  • {filteredAndSortedQuestions.filter((q) => q.solved).length} solved
                </span>
              )}
            </p>
          </div>

          <Link to="/add" className="terminal-btn flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="terminal-card mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="terminal-input w-full pl-10"
              />
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | "all")}
                className="terminal-input py-2"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="terminal-input py-2"
              >
                <option value="createdAt">Date Added</option>
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="terminal-btn-secondary p-2"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedQuestions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="terminal-card text-center py-12"
              >
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No questions match your search."
                    : "No questions yet."}
                </p>
                <Link to="/add" className="terminal-btn inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add your first question</span>
                </Link>
              </motion.div>
            ) : (
              filteredAndSortedQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <QuestionCard question={question} onUpdate={loadQuestions} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
