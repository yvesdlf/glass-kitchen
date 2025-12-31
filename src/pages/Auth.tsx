import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
          setError(validation.error.errors[0].message);
          setIsLoading(false);
          return;
        }
        
        const { error } = await login(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        const validation = signUpSchema.safeParse({ name, email, password });
        if (!validation.success) {
          setError(validation.error.errors[0].message);
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, name || undefined);
        if (error) {
          setError(error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <ScreenBackground>
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="w-full max-w-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Sign in to your cookbook" 
                : "Start your culinary journey"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <GlassInput
                icon={User}
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            )}
            
            <GlassInput
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            
            <GlassInput
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <PrimaryButton
              type="submit"
              isLoading={isLoading}
              disabled={!email || !password}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </PrimaryButton>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {isLogin 
                ? "Don't have an account? Create one" 
                : "Already have an account? Sign in"}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors text-xs"
              >
                Forgot password?
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </ScreenBackground>
  );
}
