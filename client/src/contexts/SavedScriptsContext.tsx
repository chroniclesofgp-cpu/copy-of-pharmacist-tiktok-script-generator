/**
 * SavedScriptsContext
 * Manages saved scripts in localStorage for the Pharmacist TikTok Script Generator
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SavedScript } from '@/lib/scriptData';

interface SavedScriptsContextType {
  savedScripts: SavedScript[];
  saveScript: (script: Omit<SavedScript, 'id' | 'savedAt'>) => string;
  deleteScript: (id: string) => void;
  updateLabel: (id: string, label: string) => void;
  clearAll: () => void;
}

const SavedScriptsContext = createContext<SavedScriptsContextType | null>(null);

const STORAGE_KEY = 'pharma-saved-scripts';

export function SavedScriptsProvider({ children }: { children: ReactNode }) {
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScripts));
    } catch {
      // localStorage full or unavailable
    }
  }, [savedScripts]);

  const saveScript = useCallback((script: Omit<SavedScript, 'id' | 'savedAt'>): string => {
    const id = `script-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newScript: SavedScript = {
      ...script,
      id,
      savedAt: new Date().toISOString(),
    };
    setSavedScripts(prev => [newScript, ...prev]);
    return id;
  }, []);

  const deleteScript = useCallback((id: string) => {
    setSavedScripts(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, label: string) => {
    setSavedScripts(prev => prev.map(s => s.id === id ? { ...s, label } : s));
  }, []);

  const clearAll = useCallback(() => {
    setSavedScripts([]);
  }, []);

  return (
    <SavedScriptsContext.Provider value={{ savedScripts, saveScript, deleteScript, updateLabel, clearAll }}>
      {children}
    </SavedScriptsContext.Provider>
  );
}

export function useSavedScripts() {
  const ctx = useContext(SavedScriptsContext);
  if (!ctx) throw new Error('useSavedScripts must be used within SavedScriptsProvider');
  return ctx;
}
