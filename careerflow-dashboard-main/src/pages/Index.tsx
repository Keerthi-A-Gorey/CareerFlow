import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginEmail, loginPassword);
    
    if (success) {
      toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
      navigate('/dashboard');
    } else {
      toast({ 
        title: 'Login failed', 
        description: 'Please check your credentials and try again.',
        variant: 'destructive'
      });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerPassword.length < 6) {
      toast({ 
        title: 'Password too short', 
        description: 'Password must be at least 6 characters.',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }
    
    const success = await register(registerName, registerEmail, registerPassword);
    
    if (success) {
      toast({ title: 'Welcome!', description: 'Your account has been created.' });
      navigate('/dashboard');
    } else {
      toast({ 
        title: 'Registration failed', 
        description: 'Please try again with valid information.',
        variant: 'destructive'
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left side - Branding */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                Track your career journey
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
                  <Briefcase className="h-7 w-7 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold md:text-5xl">
                  Career<span className="text-primary">Flow</span>
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-8">
                The smart way to track job applications, manage resume versions, and analyze your job search performance.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1" />
                  Track Applications
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-2" />
                  Manage Resumes
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4" />
                  Analyze Performance
                </div>
              </div>
            </div>

            {/* Right side - Auth Forms */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md border-0 shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">Get Started</CardTitle>
                  <CardDescription>Sign in or create an account to continue</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Sign In</TabsTrigger>
                      <TabsTrigger value="register">Sign Up</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="relative z-10">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="relative z-10">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-name">Name</Label>
                          <Input
                            id="register-name"
                            type="text"
                            placeholder="John Doe"
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Password</Label>
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="••••••••"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                          <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
