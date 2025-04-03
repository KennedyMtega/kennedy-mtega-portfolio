
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any;
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
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session) {
          const userData = session.user;
          // Store user data in localStorage to prevent session loss
          localStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('userData');
          setUser(null);
          navigate('/auth');
        }
      }
    );

    // Then check for existing session
    const checkAuth = async () => {
      try {
        // First check if we have cached user data
        const cachedUser = localStorage.getItem('userData');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          setIsLoading(false);
          return;
        }

        // If no cached data, check with Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          const userData = data.session.user;
          localStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        } else {
          // User is not logged in, but don't redirect automatically
          // Let the protected routes handle redirects
          setUser(null);
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
    <AuthContext.Provider value={{ user, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
