import { GoogleGenAI, Type } from "@google/genai";

/**
 * RESOURCES PEN NEURAL ENGINE
 * Centralized logic for AI-driven marketplace features.
 */
export class AIService {
  private static get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Generates technical support responses with an architectural tone.
   */
  static async generateSupportResponse(history: any[], message: string): Promise<string> {
    const chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are the Resources Pen Technical Support Core. 
        Identity: Elite SaaS Architect. 
        Tone: Professional, precise, industrial. 
        Context: Digital asset marketplace helpdesk. 
        Guidelines: Use metaphors like "blueprints", "nodes", and "infrastructure". Help with licensing, technical specs, and navigation.`,
      },
      history: history
    });

    try {
      const result = await chat.sendMessage({ message });
      return result.text || "Protocol failure: Failed to retrieve semantic payload.";
    } catch (err) {
      console.error("[AI_SERVICE_FAULT]", err);
      return "Neural link instability. Please re-authenticate your request.";
    }
  }

  /**
   * Synthesizes high-impact SEO keyword nodes using structured output.
   */
  static async synthesizeSEO(description: string): Promise<any> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this architectural asset abstract and synthesize 5 high-impact SEO keywords. Abstract: ${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                search_volume: { type: Type.INTEGER, description: "Monthly search volume estimate" },
                difficulty: { type: Type.INTEGER, description: "Ranking difficulty (1-100)" },
                intent: { type: Type.STRING, description: "Intent type: commercial, informational, transactional" }
              },
              required: ["keyword", "search_volume", "difficulty", "intent"]
            }
          }
        }
      });

      return JSON.parse(response.text || "[]");
    } catch (err) {
      console.error("[AI_SEO_FAULT]", err);
      throw new Error("Neural SEO synthesis failed.");
    }
  }
}
