
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
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

  useEffect(() => {
    console.log("Setting up auth provider...");
    
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('userData');
          navigate('/auth');
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
          
          // Also store in localStorage for backup
          localStorage.setItem('userData', JSON.stringify(data.session.user));
        } else {
          // If no session in supabase, check localStorage backup
          const cachedUser = localStorage.getItem('userData');
          if (cachedUser) {
            console.log("Using cached user data");
            setUser(JSON.parse(cachedUser));
          } else {
            console.log("No user session found");
            setUser(null);
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const signOut = async () => {
    try {
      localStorage.removeItem('userData');
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
    <AuthContext.Provider value={{ user, session, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
