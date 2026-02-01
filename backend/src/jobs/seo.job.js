const { GoogleGenAI, Type } = require("@google/genai");
const logger = require('../config/logger');

/**
 * NEURAL JOB WORKER
 * Background task to synthesize SEO metadata for new products
 */
const runSEOJob = async (productData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    logger.info(`[JOB] Initiating SEO Synthesis for: ${productData.name}`);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize high-impact SEO meta-data for: ${productData.description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    // Update DB logic would go here
    logger.info(`[JOB] SEO Synthesis Complete for: ${productData.name}`);
    return result;
  } catch (err) {
    logger.error(`[JOB_ERROR] SEO Synthesis Failed: ${err.message}`);
  }
};

module.exports = { runSEOJob };