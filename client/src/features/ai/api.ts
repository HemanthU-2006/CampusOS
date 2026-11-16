import api from '@/lib/axios';

export interface AIChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface MaintenanceTriageResult {
  category: 'electrical' | 'plumbing' | 'furniture' | 'hvac' | 'it_hardware' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  suggestedAction: string;
  safetyCaution?: string;
  estimatedHours: number;
}

export const aiApi = {
  chat: async (message: string, history: AIChatMessage[] = []): Promise<string> => {
    try {
      const res = await api.post('/ai/chat', { message, history });
      return res.data?.data?.reply || 'No response received from AI.';
    } catch (err: any) {
      return (
        '⚠️ **Campus Assistant Offline**: Could not connect to the AI endpoint (' +
        (err?.response?.data?.message || err?.message || 'Server unreachable') +
        '). Please ensure the server is running.'
      );
    }
  },

  triage: async (
    title: string,
    description: string,
    location: string
  ): Promise<MaintenanceTriageResult> => {
    try {
      const res = await api.post('/ai/triage', { title, description, location });
      return res.data?.data;
    } catch {
      // Offline fallback
      return {
        category: 'other',
        priority: 'medium',
        summary: title,
        suggestedAction: `Inspect ${location}`,
        estimatedHours: 4,
      };
    }
  },
};
