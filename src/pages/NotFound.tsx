import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Terminal, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Terminal className="w-16 h-16 text-primary glow-text-green" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-primary glow-text-green">404</h1>
        <p className="mb-2 text-xl text-foreground">
          <span className="text-destructive">Error:</span> Route not found
        </p>
        <p className="mb-6 text-muted-foreground font-mono text-sm">
          $ cd {location.pathname} <span className="text-destructive">// Permission denied</span>
        </p>
        <Link 
          to="/" 
          className="terminal-btn inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
