const { GoogleGenAI, Type } = require("@google/genai");

/**
 * NEURAL SEO ENGINE
 * Synthesizes high-impact semantic metadata for digital assets.
 */
class SEOService {
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Synthesizes optimized keyword nodes based on project description.
   */
  async synthesizeKeywords(description) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this architectural asset description and synthesize 5 high-impact SEO keywords. 
        Description: ${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                search_volume: { type: Type.INTEGER, description: "Estimated monthly volume" },
                difficulty: { type: Type.INTEGER, description: "Competition index 0-100" },
                intent: { type: Type.STRING, description: "User intent: commercial, informational, transactional" }
              },
              required: ["keyword", "search_volume", "difficulty", "intent"]
            }
          }
        }
      });

      // SDK Property access: .text directly returns the string output.
      return JSON.parse(response.text);
    } catch (err) {
      console.error("[NEURAL_ERROR] Keyword synthesis failure:", err);
      throw new Error("Neural link timeout: Could not synthesize metadata.");
    }
  }
}

module.exports = new SEOService();