
import { GoogleGenAI, Type } from "@google/genai";
import { Project, LEDStrip, PSU } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialized with process.env.API_KEY directly as required by the library guidelines.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Suggest optimal wire gauge using Gemini 3 Flash
  async suggestWireGauge(current: number, length: number, voltage: number) {
    const prompt = `
      Act as an electrical engineer. 
      For a DC circuit with:
      - Current: ${current} Amps
      - Total length (round trip): ${length * 2} meters
      - Source Voltage: ${voltage}V
      
      What is the optimal AWG wire gauge to maintain a voltage drop below 3%? 
      Provide the AWG number and a 1-sentence explanation of why.
      Format: "AWG: [number]. [Explanation]"
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text || "Calculation error.";
    } catch (e) {
      return "Suggesting standard 14 AWG for safety.";
    }
  }

  // Get design suggestions based on project environment using Gemini 3 Pro
  async getDesignSuggestions(project: Project, strips: LEDStrip[], psus: PSU[]) {
    // FIX: Corrected property access from project.selectedPSUId (which doesn't exist) to extracting unique PSU names from project subsystems.
    const usedPsuNames = Array.from(new Set(project.subsystems.map(s => {
      const p = psus.find(p => p.id === s.psuId);
      return p ? p.name : 'Unknown';
    }))).join(', ');

    const prompt = `
      Act as a senior stage lighting engineer. 
      Project: "${project.name}" in a ${project.venueType} environment.
      Selected PSUs: ${usedPsuNames}
      
      Review this specific hardware for ${project.venueType} suitability. 
      If it's Outdoor, check IP ratings. If it's Arena, check redundancy.
      Provide 3 bullet points of critical optimization.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
      });
      return response.text || "Unable to generate suggestions.";
    } catch (error) {
      return "AI service temporarily unavailable.";
    }
  }

  // Generate technical documentation using Gemini 3 Flash
  async generateTechnicalDocs(project: Project) {
      const prompt = `
        Generate an engineering short-circuit and safety report for: ${JSON.stringify(project)}
        Focus on fuse selectivity and IP rating compliance for ${project.venueType}.
      `;
      // FIX: Added try-catch block and property check for response.text to ensure robust error handling.
      try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "Error generating report.";
      } catch (e) {
        return "Technical documentation service currently unavailable.";
      }
  }
}
