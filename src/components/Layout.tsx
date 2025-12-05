import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { GamificationPanel } from "./GamificationPanel";
import { Terminal } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="scanlines fixed inset-0 pointer-events-none z-50" />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/50">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Terminal className="w-6 h-6 text-primary glow-text-green" />
            <h1 className="text-xl font-bold text-primary glow-text-green">
              DSA_TRACKER<span className="cursor-blink" />
            </h1>
          </Link>
          
          <div className="text-xs text-muted-foreground">
            <span className="text-primary">$</span> ./track --progress
          </div>
        </header>
        
        {/* Content area with gamification panel */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
          
          {/* Right panel - Gamification */}
          <GamificationPanel />
        </div>
      </div>
    </div>
  );
}
