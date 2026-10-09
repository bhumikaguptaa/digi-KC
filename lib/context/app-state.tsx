"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AppState } from "../data/types";
import { emptyState } from "../data/defaults";

const STORAGE_KEY = "first72-state";

interface AppStateContextValue {
  state: AppState;
  setState: (updater: (prev: AppState) => AppState) => void;
  resetDemo: () => void;
  loaded: boolean;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(emptyState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setStateRaw(JSON.parse(raw));
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, loaded]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--base-font-scale",
      state.accessibility.largerText ? "1.25" : "1"
    );
    if (state.accessibility.highContrast) {
      root.setAttribute("data-contrast", "high");
    } else {
      root.removeAttribute("data-contrast");
    }
  }, [state.accessibility.largerText, state.accessibility.highContrast]);

  const setState = useCallback((updater: (prev: AppState) => AppState) => {
    setStateRaw((prev) => updater(prev));
  }, []);

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStateRaw(emptyState);
  }, []);

  return (
    <AppStateContext.Provider value={{ state, setState, resetDemo, loaded }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
