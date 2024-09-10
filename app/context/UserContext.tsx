'use client';

import { createContext, useContext, useState } from 'react';

interface UserContextType {
  session: string | null;
  setSession: (session: string | null) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        session,
        setSession,
        userId,
        setUserId,
        loading,
        setLoading,
        error,
        setError, // Include setError in the context
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
