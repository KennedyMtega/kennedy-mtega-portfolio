
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
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        console.log("Session refreshed:", data.session.user.id);
        setSession(data.session);
        setUser(data.session.user);
        
        // Also store in localStorage for backup
        localStorage.setItem('userData', JSON.stringify(data.session.user));
        localStorage.setItem('sessionData', JSON.stringify(data.session));
      } else {
        // If not on auth page, check if we need to redirect
        if (!location.pathname.includes('/auth') && !localStorage.getItem('userData')) {
          console.log("No session found during refresh, redirecting to auth");
          navigate('/auth', { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Session refresh error:', err);
    }
  };

  useEffect(() => {
    console.log("Setting up auth provider...");
    
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        
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
        // First try to get session from supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          console.log("Found existing session:", data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          
          // Store session and user data in localStorage
          localStorage.setItem('userData', JSON.stringify(data.session.user));
          localStorage.setItem('sessionData', JSON.stringify(data.session));
        } else {
          // If no session in supabase, check localStorage backup
          const cachedUser = localStorage.getItem('userData');
          const cachedSession = localStorage.getItem('sessionData');
          
          if (cachedUser && cachedSession) {
            console.log("Using cached session data");
            setUser(JSON.parse(cachedUser));
            setSession(JSON.parse(cachedSession));
            
            // Try to refresh the session with Supabase
            refreshSession();
          } else {
            console.log("No user session found");
            setUser(null);
            setSession(null);
            
            // If not on auth page, redirect to auth
            if (!location.pathname.includes('/auth')) {
              console.log("Redirecting to auth page");
              navigate('/auth', { replace: true });
            }
          }
        }
      } catch (err: any) {
        console.error('Auth check error:', err);
        toast({
          title: "Authentication error",
          description: err.message,
          variant: "destructive",
        });
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
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
