import { BookOpen, LogOut, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Chef";

  return (
    <ScreenBackground>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-card/40 border-b border-border/30">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recipes</h1>
              <p className="text-sm text-muted-foreground">Interactive cookbook – v1</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-sm border border-border/40 hover:bg-card/80"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="backdrop-blur-xl bg-card/90 border-border/50 rounded-xl"
              >
                <DropdownMenuItem disabled className="text-muted-foreground">
                  <span className="truncate max-w-[180px]">
                    {displayName}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          <GlassCard className="p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/20 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Your recipe library is empty
            </h2>
            
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Add your first recipe to get started.
            </p>
            
            <button
              onClick={() => navigate("/create")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Recipe
            </button>
          </GlassCard>
        </main>

        {/* Floating Action Button */}
        <button
          onClick={() => navigate("/create")}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </ScreenBackground>
  );
}
