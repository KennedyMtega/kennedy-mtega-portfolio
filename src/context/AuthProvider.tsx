
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to refresh session data
  const refreshSession = async () => {
    try {
      console.log("Refreshing session...");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        console.log("Session refreshed successfully:", data.session.user.id);
        setSession(data.session);
        setUser(data.session.user);
        
        // Also store in localStorage for backup
        localStorage.setItem('userData', JSON.stringify(data.session.user));
        localStorage.setItem('sessionData', JSON.stringify(data.session));
        return data.session;
      } else {
        console.log("No session found during refresh");
        
        // Try to get data from localStorage
        const cachedUser = localStorage.getItem('userData');
        const cachedSession = localStorage.getItem('sessionData');
        
        if (cachedUser && cachedSession) {
          console.log("Using cached session data");
          const parsedUser = JSON.parse(cachedUser);
          const parsedSession = JSON.parse(cachedSession);
          
          setUser(parsedUser);
          setSession(parsedSession);
          
          return parsedSession;
        }
        
        // Clear state if no session found
        setUser(null);
        setSession(null);
        
        // Only redirect to auth if not already there and not a public route
        if (!location.pathname.startsWith('/auth') && 
            !location.pathname === '/' && 
            !location.pathname.startsWith('/projects') && 
            !location.pathname.startsWith('/blog') && 
            !location.pathname.startsWith('/contact')) {
          console.log("No session found during refresh, redirecting to auth");
          navigate('/auth', { state: { returnTo: location.pathname } });
        }
        
        return null;
      }
    } catch (err: any) {
      console.error('Session refresh error:', err);
      return null;
    }
  };

  useEffect(() => {
    console.log("Setting up auth provider...");
    let mounted = true;
    
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        if (!mounted) return;
        
        if (currentSession) {
          console.log("Session updated from auth event");
          setSession(currentSession);
          setUser(currentSession.user);
          localStorage.setItem('userData', JSON.stringify(currentSession.user));
          localStorage.setItem('sessionData', JSON.stringify(currentSession));
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          localStorage.removeItem('userData');
          localStorage.removeItem('sessionData');
          setUser(null);
          setSession(null);
          
          // Only redirect if not already on auth page
          if (!location.pathname.includes('/auth')) {
            navigate('/auth');
          }
        }
      }
    );

    // Then check for existing session
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // First try to get session from supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        if (data.session) {
          console.log("Found existing session:", data.session.user.id);
          
          if (mounted) {
            setSession(data.session);
            setUser(data.session.user);
            
            // Store session and user data in localStorage
            localStorage.setItem('userData', JSON.stringify(data.session.user));
            localStorage.setItem('sessionData', JSON.stringify(data.session));
          }
        } else {
          console.log("No active session found");
          
          // If no session in supabase, check localStorage backup
          const cachedUser = localStorage.getItem('userData');
          const cachedSession = localStorage.getItem('sessionData');
          
          if (cachedUser && cachedSession && mounted) {
            console.log("Using cached session data");
            setUser(JSON.parse(cachedUser));
            setSession(JSON.parse(cachedSession));
            
            // Try to refresh the session with Supabase after a short delay
            // to avoid any potential deadlocks
            setTimeout(() => {
              if (mounted) refreshSession();
            }, 0);
          } else if (mounted) {
            console.log("No user session found");
            setUser(null);
            setSession(null);
            
            // If not on public pages, redirect to auth
            if (!location.pathname.includes('/auth') && 
                !location.pathname === '/' && 
                !location.pathname.startsWith('/projects') && 
                !location.pathname.startsWith('/blog') && 
                !location.pathname.startsWith('/contact')) {
              console.log("Redirecting to auth page");
              navigate('/auth', { state: { returnTo: location.pathname } });
            }
          }
        }
      } catch (err: any) {
        console.error('Auth check error:', err);
        
        if (mounted) {
          toast({
            title: "Authentication error",
            description: err.message,
            variant: "destructive",
          });
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast, navigate, location.pathname]);

  const signOut = async () => {
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('sessionData');
      await supabase.auth.signOut();
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signOut, isLoading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
