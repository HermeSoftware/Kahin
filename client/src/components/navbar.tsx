import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { History, Settings, User, Moon } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="glass-effect sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center pulse-glow">
            <Moon className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-shadow">Kahin</h1>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link href="/history">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              data-testid="button-history"
            >
              <History className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/settings">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            data-testid="button-profile"
          >
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
