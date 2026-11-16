import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
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

const SJBIT_SYSTEM_PROMPT = `You are CampusOS AI ("Sage"), the intelligent virtual assistant for SJBIT (SJB Institute of Technology, Bengaluru).
Your purpose is to provide friendly, accurate, and concise assistance to students, faculty, and administrators.

Key Campus Knowledge:
- College: SJB Institute of Technology (SJBIT), affiliated with VTU, located at BGS Health & Education City, Kengeri, Bengaluru.
- Leadership: Dr. K. V. Mahendra Prashanth is the Principal & Head of Institution.
- Department HODs:
  * ISE (Information Science & Engineering): Dr. Gopalakrishna M T (Professor & HOD, isehod@sjbit.edu.in, +91-8660744196)
  * CSE (Computer Science & Engineering): Dr. Krishna A N (csehod@sjbit.edu.in)
  * ECE (Electronics & Communication): Dr. Chandrappa D N
  * AI & ML: Dr. Abhilash C N
  * EEE: Dr. Chandrashekar M J
  * Mechanical: Dr. Vitala H R
  * Civil: Dr. Prasad C S M V
- Campus Venues:
  * Main Auditorium (Hall A): Capacity 450, BGS Central Block. Equipped with dual projectors and stage lighting.
  * Alan Turing Seminar Hall: Capacity 120, CS/IS Department Block 3rd floor.
  * Innovation & Robotics Lab: Capacity 60, Mech/IoT Block 2nd floor.
- CampusOS Modules:
  * Venue Bookings: Requires faculty review; automated conflict detection prevents double booking.
  * Events: Students get QR ticket passes. If an event is at capacity, they join a waitlist and are auto-promoted if someone cancels.
  * Hardware & Lab Resources: Supports checkout for Arduino, Raspberry Pi, oscilloscopes, and 3D printer slots with 4-step tracking (Requested -> Approved -> Issued -> Returned).
  * Maintenance: Report physical or IT defects. 4-step resolution (Open -> Assigned -> In Progress -> Resolved).
  * Lost & Found: Post items found or submit claims with proof of ownership.

Guidelines:
- Keep responses professional, warm, concise, and formatted in clean markdown (bullet points, bold text).
- If asked about booking or reporting, guide them to the exact tab or button in CampusOS.`;

export class AIService {
  private static getClient(): GoogleGenAI | null {
    if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY.trim() === '') {
      return null;
    }
    return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  static async chat(prompt: string, history: ChatMessage[] = []): Promise<string> {
    const client = this.getClient();

    if (!client) {
      return (
        "🤖 **CampusOS Sage (Local Mode)**:\n\n" +
        "I'm ready to assist you with SJBIT campus services! To unlock live real-time Gemini AI reasoning, simply add your free Gemini API key to `server/.env` as `GEMINI_API_KEY=AIzaSy...`.\n\n" +
        `Regarding your question *"${prompt}"*:\n` +
        "• **Venues & Bookings**: You can check live availability or reserve BGS Auditorium and Alan Turing Hall under the **Venues** tab.\n" +
        "• **Campus Events**: View upcoming fests and technical seminars under **Events**.\n" +
        "• **Hardware Checkout**: Check out sensors, Raspberry Pi, and lab equipment under **Resources**.\n" +
        "• **Maintenance**: Report any classroom or lab issues under **Maintenance**."
      );
    }

    try {
      // Build conversation contents
      const contents: any[] = [];

      // Add system prompt context
      contents.push({
        role: 'user',
        parts: [{ text: `${SJBIT_SYSTEM_PROMPT}\n\nPlease keep the context above in mind for all responses.` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: "Understood! I am Sage, the SJBIT CampusOS virtual assistant. How can I assist today?" }],
      });

      // Add past turns
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }

      // Add current user prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
      });

      return response.text || 'I received your query, but could not generate a response. Please try again.';
    } catch (error: any) {
      console.error('Gemini API Error:', error?.message || error);
      return (
        "⚠️ **AI Service Notice**: Unable to contact the Gemini AI model at this moment (" +
        (error?.message || 'Check API key or network') +
        "). You can still browse and use all CampusOS features normally."
      );
    }
  }

  static async triageTicket(
    title: string,
    description: string,
    location: string
  ): Promise<MaintenanceTriageResult> {
    const client = this.getClient();

    // Deterministic fallback if API key is not configured yet
    const fallbackCategory = ((): MaintenanceTriageResult['category'] => {
      const lower = `${title} ${description}`.toLowerCase();
      if (lower.includes('light') || lower.includes('wire') || lower.includes('power') || lower.includes('spark') || lower.includes('switch')) return 'electrical';
      if (lower.includes('water') || lower.includes('pipe') || lower.includes('tap') || lower.includes('leak') || lower.includes('drain')) return 'plumbing';
      if (lower.includes('ac') || lower.includes('cooling') || lower.includes('heat') || lower.includes('hvac')) return 'hvac';
      if (lower.includes('projector') || lower.includes('screen') || lower.includes('pc') || lower.includes('wifi') || lower.includes('mouse')) return 'it_hardware';
      if (lower.includes('desk') || lower.includes('chair') || lower.includes('bench') || lower.includes('door') || lower.includes('window')) return 'furniture';
      if (lower.includes('clean') || lower.includes('garbage') || lower.includes('trash') || lower.includes('floor')) return 'cleaning';
      return 'other';
    })();

    const fallbackPriority = ((): MaintenanceTriageResult['priority'] => {
      const lower = `${title} ${description}`.toLowerCase();
      if (lower.includes('fire') || lower.includes('spark') || lower.includes('flood') || lower.includes('urgent') || lower.includes('danger')) return 'critical';
      if (lower.includes('leak') || lower.includes('broken') || lower.includes('not working') || lower.includes('exam')) return 'high';
      return 'medium';
    })();

    if (!client) {
      return {
        category: fallbackCategory,
        priority: fallbackPriority,
        summary: title,
        suggestedAction: `Dispatch ${fallbackCategory} technician to inspect ${location}.`,
        estimatedHours: fallbackPriority === 'critical' ? 1 : fallbackPriority === 'high' ? 4 : 24,
      };
    }

    try {
      const prompt = `You are an automated campus facility maintenance triage system.
Analyze the following maintenance issue reported at "${location}":
Title: "${title}"
Description: "${description}"

Classify into:
1. category: one of ["electrical", "plumbing", "furniture", "hvac", "it_hardware", "cleaning", "other"]
2. priority: one of ["low", "medium", "high", "critical"]
3. summary: a concise 1-sentence diagnostic summary
4. suggestedAction: what the technician should do upon arrival
5. safetyCaution: any immediate warning if dangerous (e.g. "Do not touch live wires")
6. estimatedHours: estimated hours to resolve (number, e.g. 2)

Return ONLY valid JSON with keys: category, priority, summary, suggestedAction, safetyCaution, estimatedHours.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = response.text || '{}';
      // Clean up markdown code block if present
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        category: parsed.category || fallbackCategory,
        priority: parsed.priority || fallbackPriority,
        summary: parsed.summary || title,
        suggestedAction: parsed.suggestedAction || `Inspect ${location}`,
        safetyCaution: parsed.safetyCaution || undefined,
        estimatedHours: Number(parsed.estimatedHours) || 4,
      };
    } catch {
      return {
        category: fallbackCategory,
        priority: fallbackPriority,
        summary: title,
        suggestedAction: `Dispatch facility technician to ${location}.`,
        estimatedHours: 4,
      };
    }
  }
}
