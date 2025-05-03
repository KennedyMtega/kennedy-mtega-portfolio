import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get redirect path from location state or query params
  const getRedirectPath = () => {
    // Check for state first (from React Router)
    if (location.state?.returnTo) {
      return location.state.returnTo;
    }
    
    // Then check query params
    const params = new URLSearchParams(location.search);
    const returnTo = params.get('returnTo');
    if (returnTo) {
      return returnTo;
    }
    
    // Default to dashboard
    return '/dashboard';
  };

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking authentication status");
        
        // Check with Supabase first
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setCheckingAuth(false);
          return;
        }
        
        if (data.session) {
          console.log("Session found, redirecting to:", getRedirectPath());
          // Store user data in localStorage
          localStorage.setItem('userData', JSON.stringify(data.session.user));
          localStorage.setItem('sessionData', JSON.stringify(data.session));
          
          // Immediately redirect and exit the function
          setCheckingAuth(false);
          navigate(getRedirectPath(), { replace: true });
          return;
        }
        
        console.log("No session found in Supabase");
        
        // If no session, check localStorage as fallback
        const cachedUser = localStorage.getItem('userData');
        const cachedSession = localStorage.getItem('sessionData');
        
        if (cachedUser && cachedSession) {
          console.log("Found cached user data, attempting to validate");
          // Try to refresh the session first
          const { data: refreshData, error: refreshError } = await supabase.auth.getUser();
          
          if (!refreshError && refreshData.user) {
            console.log("Cached session validated, redirecting");
            setCheckingAuth(false);
            navigate(getRedirectPath(), { replace: true });
            return;
          } else {
            console.log("Cached session invalid, clearing local storage");
            localStorage.removeItem('userData');
            localStorage.removeItem('sessionData');
          }
        }
        
        // If we got here, we're not logged in
        setCheckingAuth(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setCheckingAuth(false);
      }
    };
    
    checkSession();
  }, [navigate, location]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      
      // Check for hardcoded credentials first
      if (email === 'mtegakennedy@gmail.com' && password === 'Helphelp@2024') {
        console.log("Using hardcoded credentials");
        
        // Store hardcoded user data in localStorage
        const userData = {
          email: 'mtegakennedy@gmail.com',
          name: 'Kennedy Mtega',
          role: 'admin',
          id: '00000000-0000-0000-0000-000000000000'
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        toast({
          title: "Login successful",
          description: "Welcome back to your dashboard.",
        });
        
        // Force navigation and prevent further execution
        navigate('/dashboard', { replace: true });
        return;
      }
      
      // Otherwise try normal supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Login successful, session:", data.session);
      
      // Store user data in localStorage
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('sessionData', JSON.stringify(data.session));
      
      toast({
        title: "Login successful",
        description: "Welcome back to your dashboard.",
      });
      
      // Force immediate navigation with replace: true
      navigate('/dashboard', { replace: true });
      return; // Early return to prevent further execution
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
      
      // If login fails, try signup as a fallback
      if (email && password && email.includes('@') && password.length >= 6) {
        try {
          console.log("Attempting signup as fallback");
          const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signupError) throw signupError;
          
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
            if (data.session) {
              localStorage.setItem('sessionData', JSON.stringify(data.session));
            }
            
            toast({
              title: "Account created",
              description: "Your account has been created and you are now logged in.",
            });
            
            navigate('/dashboard', { replace: true });
            return; // Early return to prevent further execution
          }
        } catch (signupError: any) {
          console.error("Signup error:", signupError);
          // Don't show this error to avoid confusion
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleAuth} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-[#191970] flex items-center justify-center">
          <div className="px-8 text-center text-white">
            <h1 className="text-4xl font-display font-bold mb-4">Kennedy Mtega</h1>
            <p className="text-xl">Developer. Entrepreneur. Visionary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
