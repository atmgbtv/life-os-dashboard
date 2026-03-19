import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SalahTime = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'None';

export interface Goal {
  id: string;
  title: string;
  currentProgress: number;
  maxProgress: number;
  unit: string;
}

export interface Habit {
  id: string;
  title: string;
  quantity: number;
  completedDates: string[]; // Stores 'YYYY-MM-DD' strings
  linkedGoalId?: string;
  salahTime: SalahTime;
}

export type DailyContribution = Record<string, number>; // date "YYYY-MM-DD" -> completion ratio 0.0 to 1.0

interface AppState {
  goals: Goal[];
  habits: Habit[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goalUpdate: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  updateHabit: (id: string, habitUpdate: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  
  toggleHabitCompletion: (id: string, dateStr: string) => void;
  relocateHabit: (id: string, newSalahTime: SalahTime) => void;
  
  getDailyContribution: (dateStr: string) => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      goals: [],
      habits: [],
      
      addGoal: (goal) => set((state) => {
        if (state.goals.length >= 3) return state;
        return {
          goals: [...state.goals, { ...goal, id: crypto.randomUUID() }]
        };
      }),
      
      updateGoal: (id, goalUpdate) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...goalUpdate } : g)
      })),
      
      removeGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),
      
      addHabit: (habit) => set((state) => {
        if (state.habits.length >= 7) return state;
        return {
          habits: [...state.habits, { ...habit, completedDates: habit.completedDates || [], id: crypto.randomUUID() }]
        };
      }),
      
      updateHabit: (id, habitUpdate) => set((state) => ({
        habits: state.habits.map(h => h.id === id ? { ...h, ...habitUpdate } : h)
      })),
      
      removeHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),
      
      toggleHabitCompletion: (id, dateStr) => set((state) => {
        let habitToUpdate = state.habits.find(h => h.id === id);
        if (!habitToUpdate) return state;
        
        const isCompleted = habitToUpdate.completedDates.includes(dateStr);
        let newCompletedDates = isCompleted
          ? habitToUpdate.completedDates.filter(d => d !== dateStr)
          : [...habitToUpdate.completedDates, dateStr];
          
        const nextHabits = state.habits.map(h => 
          h.id === id ? { ...h, completedDates: newCompletedDates } : h
        );

        // Sync with goal if completed
        // "Should be able to adjust quantity of habit and should sync with goals progress bar when I hit checkmark"
        const linkedGoalId = habitToUpdate.linkedGoalId;
        let nextGoals = state.goals;
        if (linkedGoalId) {
          nextGoals = state.goals.map(g => {
            if (g.id === linkedGoalId) {
              const delta = isCompleted ? -habitToUpdate.quantity : habitToUpdate.quantity;
              return { ...g, currentProgress: Math.max(0, g.currentProgress + delta) };
            }
            return g;
          });
        }

        return { habits: nextHabits, goals: nextGoals };
      }),
      
      relocateHabit: (id, newSalahTime) => set((state) => ({
        habits: state.habits.map(h => h.id === id ? { ...h, salahTime: newSalahTime } : h)
      })),
      
      getDailyContribution: (dateStr) => {
        const state = get();
        if (state.habits.length === 0) return 0;
        
        const completedHabits = state.habits.filter(h => h.completedDates.includes(dateStr));
        return completedHabits.length / state.habits.length;
      }
    }),
    {
      name: 'life-os-storage',
    }
  )
);
