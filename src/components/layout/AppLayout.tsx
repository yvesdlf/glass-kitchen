import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Upload, Calculator, List, FileSpreadsheet, LogOut, User } from "lucide-react";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const tabs = [
  { value: "/", label: "Recipe Book", icon: BookOpen },
  { value: "/upload-recipe", label: "Upload Recipe", icon: Upload },
  { value: "/advanced-costing", label: "Advanced Costing", icon: Calculator },
  { value: "/price-list", label: "Price List", icon: List },
  { value: "/upload-price-list", label: "Upload Prices", icon: FileSpreadsheet },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Chef";
  
  const currentTab = tabs.find(t => t.value === location.pathname)?.value || "/";

  return (
    <ScreenBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-card/40 border-b border-border/30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
          
          {/* Tabs Navigation */}
          <div className="max-w-6xl mx-auto px-6 pb-4">
            <Tabs value={currentTab} onValueChange={(value) => navigate(value)}>
              <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/30 p-1">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm px-3 py-2"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </ScreenBackground>
  );
}
