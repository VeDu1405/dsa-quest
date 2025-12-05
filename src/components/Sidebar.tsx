import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Folder, Plus, Home, List, CheckCircle, Circle, RotateCcw } from "lucide-react";
import { getTopics, getQuestions, resetData, getUser } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [topics, setTopics] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const currentTopic = searchParams.get("topic");
  const currentFilter = searchParams.get("filter");

  useEffect(() => {
    const loadData = () => {
      setTopics(getTopics());
      const questions = getQuestions();
      setTotalCount(questions.length);
      setSolvedCount(questions.filter((q) => q.solved).length);
    };
    loadData();

    // Listen for storage changes
    const handleStorageChange = () => loadData();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("questionsUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("questionsUpdated", handleStorageChange);
    };
  }, [location]);

  const handleReset = () => {
    if (confirm("Reset all data? This cannot be undone.")) {
      resetData();
      window.dispatchEvent(new Event("questionsUpdated"));
      window.location.href = "/";
    }
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="text-sm text-muted-foreground mb-2">
          <span className="text-secondary">~/</span>dsa-tracker
        </div>
        <div className="flex items-center gap-2 text-primary glow-text-green">
          <span className="text-2xl font-bold">{solvedCount}</span>
          <span className="text-muted-foreground text-sm">/ {totalCount} solved</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 mb-6">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all",
              location.pathname === "/" && !currentTopic && !currentFilter
                ? "bg-primary/20 text-primary border border-primary/50 glow-green"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/add"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all",
              location.pathname === "/add"
                ? "bg-secondary/20 text-secondary border border-secondary/50 glow-cyan"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3">
            <span className="text-secondary">$</span> filter
          </div>
          <div className="space-y-1">
            <Link
              to="/?filter=all"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all",
                currentFilter === "all" || (!currentFilter && !currentTopic && location.pathname === "/")
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <List className="w-4 h-4" />
              <span>All Questions</span>
              <span className="ml-auto text-xs text-muted-foreground">{totalCount}</span>
            </Link>
            <Link
              to="/?filter=solved"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all",
                currentFilter === "solved"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Solved</span>
              <span className="ml-auto text-xs text-primary">{solvedCount}</span>
            </Link>
            <Link
              to="/?filter=unsolved"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all",
                currentFilter === "unsolved"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Circle className="w-4 h-4 text-muted-foreground" />
              <span>Unsolved</span>
              <span className="ml-auto text-xs text-muted-foreground">{totalCount - solvedCount}</span>
            </Link>
          </div>
        </div>

        {/* Topics */}
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3">
            <span className="text-secondary">$</span> topics
          </div>
          <div className="space-y-1">
            {topics.map((topic) => {
              const questions = getQuestions().filter((q) => q.topic === topic);
              const solved = questions.filter((q) => q.solved).length;
              return (
                <Link
                  key={topic}
                  to={`/?topic=${encodeURIComponent(topic)}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all",
                    currentTopic === topic
                      ? "bg-muted text-foreground border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Folder className="w-4 h-4" />
                  <span className="truncate">{topic}</span>
                  <span className="ml-auto text-xs">
                    <span className="text-primary">{solved}</span>
                    <span className="text-muted-foreground">/{questions.length}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Reset button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Data</span>
        </button>
      </div>
    </aside>
  );
}
