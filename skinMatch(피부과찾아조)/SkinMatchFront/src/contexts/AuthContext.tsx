// src/contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface User {
    id: string;
    email: string;
    name: string;
    nickname?: string;
    profileImage?: string;
    gender?: string;
    birthYear?: string;
    nationality?: string;
    allergies?: string;
    surgicalHistory?: string;
    provider?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuthState: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
            </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
