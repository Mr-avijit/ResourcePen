const { GoogleGenAI, Type } = require("@google/genai");

class SEOService {
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async synthesizeKeywords(description) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize 5 high-impact SEO keyword nodes for: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              difficulty: { type: Type.INTEGER },
              intent: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  }
}

module.exports = new SEOService();