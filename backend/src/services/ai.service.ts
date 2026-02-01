
import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";

/**
 * ARCHITECTURAL CORE: AI SERVICE
 * Handles neural synthesis for support and growth engines.
 */
export class AIService {
  private static get client() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async generateSupportResponse(history: any[], message: string): Promise<string> {
    const ai = this.client;
    const chat: Chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are the Resources Pen Technical Support Core. Tone: Architectural, precise, professional. Metadata: Blueprints, scalability, infrastructure.",
      },
      history: history
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Neural connection error: Packet loss detected.";
  }

  static async synthesizeSEOKeywords(productDescription: string): Promise<any> {
    const ai = this.client;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize 5 high-impact SEO keywords for this product: ${productDescription}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          // Use Type enum for robust schema definition per SDK guidelines
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              volume: { type: Type.STRING },
              intent: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  }
}
