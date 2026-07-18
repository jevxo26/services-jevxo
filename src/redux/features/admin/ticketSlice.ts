import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  assignedTo?: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface TicketState {
  tickets: SupportTicket[];
}

const STORAGE_KEY = 'jevxo services_support_tickets';

const loadTickets = (): SupportTicket[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveTickets = (tickets: SupportTicket[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // ignore
  }
};

const initialState: TicketState = {
  tickets: [],
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    hydrateTickets(state) {
      state.tickets = loadTickets();
    },
    createTicket(state, action: PayloadAction<Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>>) {
      const newTicket: SupportTicket = {
        ...action.payload,
        id: `TKT-${Date.now()}`,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tickets.unshift(newTicket);
      saveTickets(state.tickets);
    },
    updateTicketStatus(state, action: PayloadAction<{ id: string; status: TicketStatus }>) {
      const ticket = state.tickets.find(t => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status;
        ticket.updatedAt = new Date().toISOString();
        saveTickets(state.tickets);
      }
    },
    updateTicketPriority(state, action: PayloadAction<{ id: string; priority: TicketPriority }>) {
      const ticket = state.tickets.find(t => t.id === action.payload.id);
      if (ticket) {
        ticket.priority = action.payload.priority;
        ticket.updatedAt = new Date().toISOString();
        saveTickets(state.tickets);
      }
    },
    deleteTicket(state, action: PayloadAction<string>) {
      state.tickets = state.tickets.filter(t => t.id !== action.payload);
      saveTickets(state.tickets);
    },
  },
});

export const {
  hydrateTickets,
  createTicket,
  updateTicketStatus,
  updateTicketPriority,
  deleteTicket,
} = ticketSlice.actions;

export default ticketSlice.reducer;
