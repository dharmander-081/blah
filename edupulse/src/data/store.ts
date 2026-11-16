import { create } from 'zustand';
import { EnrichedStudent } from './types';

interface Filters {
  department: string | null;
  semester: number | null;
  riskBand: ('critical' | 'moderate' | 'safe')[];
  searchQuery: string;
}

interface AppState {
  role: 'dean' | 'mentor' | 'student';
  setRole: (role: 'dean' | 'mentor' | 'student') => void;
  
  currentStudentId: string | null;
  setCurrentStudentId: (id: string | null) => void;
  
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
  
  drawerStudentId: string | null;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  students: EnrichedStudent[];
  setStudents: (students: EnrichedStudent[]) => void;
  
  // Computed getters
  filteredStudents: () => EnrichedStudent[];
  drawerStudent: () => EnrichedStudent | null;
  currentStudent: () => EnrichedStudent | null;
}

const defaultFilters: Filters = {
  department: null,
  semester: null,
  riskBand: [],
  searchQuery: ''
};

export const useAppStore = create<AppState>((set, get) => ({
  role: 'mentor',
  setRole: (role) => set({ role }),
  
  currentStudentId: null,
  setCurrentStudentId: (id) => set({ currentStudentId: id }),
  
  filters: defaultFilters,
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  resetFilters: () => set({ filters: defaultFilters }),
  
  drawerStudentId: null,
  openDrawer: (id) => set({ drawerStudentId: id }),
  closeDrawer: () => set({ drawerStudentId: null }),
  
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  
  students: [],
  setStudents: (students) => set({ students }),
  
  filteredStudents: () => {
    const { students, filters } = get();
    return students.filter(student => {
      if (filters.department && student.department !== filters.department) return false;
      if (filters.semester && student.semester !== filters.semester) return false;
      if (filters.riskBand.length > 0 && !filters.riskBand.includes(student.risk.band)) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = student.full_name.toLowerCase().includes(query);
        const matchesId = student.student_id.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }
      return true;
    });
  },
  
  drawerStudent: () => {
    const { students, drawerStudentId } = get();
    return students.find(s => s.student_id === drawerStudentId) || null;
  },
  
  currentStudent: () => {
    const { students, currentStudentId } = get();
    return students.find(s => s.student_id === currentStudentId) || null;
  }
}));
