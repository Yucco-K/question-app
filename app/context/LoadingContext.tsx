'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import Spinner from '../components/ui/Spinner';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
    {isLoading && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <Spinner />
      </div>
    )}
    {children}
  </LoadingContext.Provider>
  );
};
