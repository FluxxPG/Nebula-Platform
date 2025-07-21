import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

export interface Rule {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}

interface RulesStore {
  rules: Rule[];
  addRule: (rule: Rule) => void;
  removeRule: (id: string) => void;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  clearRules: () => void;
}

export const useRulesStore = create<RulesStore>((set) => ({
  rules: [],
  addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
  removeRule: (id) => set((state) => ({ rules: state.rules.filter(r => r.id !== id) })),
  updateRule: (id, updates) => set((state) => ({
    rules: state.rules.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  clearRules: () => set({ rules: [] }),
}));
