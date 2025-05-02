
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'student' | 'admin' | null;
  login: (email: string, password: string, userType: string, adminCode?: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, userType: string, adminCode?: string, idNumber?: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

interface User {
  email: string;
  name: string;
  userType: 'student' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userType, setUserType] = useState<'student' | 'admin' | null>(
    localStorage.getItem('userType') as 'student' | 'admin' | null
  );

  const login = async (email: string, password: string, userType: string, adminCode?: string): Promise<boolean> => {
    // Vérification du code administrateur si type = admin
    if (userType === 'admin' && adminCode !== '0000') {
      toast({
        title: 'Erreur de connexion',
        description: 'Code administrateur invalide',
        variant: 'destructive',
      });
      return false;
    }

    // Simulation d'une vérification d'authentification
    if (email === 'test@gmail.com' && password === 'test') {
      setIsAuthenticated(true);
      setUserType(userType as 'student' | 'admin');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', userType);
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue sur la plateforme d'emploi du temps (${userType === 'admin' ? 'Administrateur' : 'Étudiant'})`,
      });
      return true;
    }
    
    toast({
      title: 'Erreur de connexion',
      description: 'Email ou mot de passe incorrect',
      variant: 'destructive',
    });
    return false;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    userType: string,
    adminCode?: string,
    idNumber?: string
  ): Promise<boolean> => {
    // Vérification du code administrateur si type = admin
    if (userType === 'admin' && adminCode !== '0000') {
      toast({
        title: 'Erreur d\'inscription',
        description: 'Code administrateur invalide',
        variant: 'destructive',
      });
      return false;
    }

    // Vérification de la carte d'identité pour admin
    if (userType === 'admin' && (!idNumber || idNumber.trim() === '')) {
      toast({
        title: 'Erreur d\'inscription',
        description: 'Numéro de carte d\'identité requis pour un compte administrateur',
        variant: 'destructive',
      });
      return false;
    }

    // Simulation d'une création de compte réussie
    toast({
      title: 'Inscription réussie',
      description: 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
    });
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulation d'un envoi d'email de réinitialisation
    toast({
      title: 'Email envoyé',
      description: 'Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.',
    });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    toast({
      title: 'Déconnexion',
      description: 'Vous êtes maintenant déconnecté',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userType, 
      login, 
      logout, 
      register, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
