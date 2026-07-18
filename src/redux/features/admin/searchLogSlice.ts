import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchLogEntry {
  id: string;
  query: string;
  sessionId: string;
  page: string;
  timestamp: string;
  userAgent?: string;
}

interface SearchLogState {
  logs: SearchLogEntry[];
}

const STORAGE_KEY = 'jevxo services_search_logs';
const MAX_LOGS = 500;

// Generate or retrieve session ID
export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem('jevxo services_session_id');
  if (!sid) {
    sid = `SES-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now()}`;
    sessionStorage.setItem('jevxo services_session_id', sid);
  }
  return sid;
};

const loadLogs = (): SearchLogEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLogs = (logs: SearchLogEntry[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
  } catch {
    // ignore
  }
};

const initialState: SearchLogState = {
  logs: [],
};

const searchLogSlice = createSlice({
  name: 'searchLogs',
  initialState,
  reducers: {
    hydrateLogs(state) {
      state.logs = loadLogs();
    },
    logSearch(state, action: PayloadAction<{ query: string; page: string }>) {
      if (!action.payload.query.trim() || action.payload.query.length < 2) return;
      const entry: SearchLogEntry = {
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        query: action.payload.query.trim(),
        sessionId: getOrCreateSessionId(),
        page: action.payload.page,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 80) : undefined,
      };
      state.logs.unshift(entry);
      if (state.logs.length > MAX_LOGS) {
        state.logs = state.logs.slice(0, MAX_LOGS);
      }
      saveLogs(state.logs);
    },
    clearLogs(state) {
      state.logs = [];
      saveLogs([]);
    },
  },
});

export const { hydrateLogs, logSearch, clearLogs } = searchLogSlice.actions;
export default searchLogSlice.reducer;
