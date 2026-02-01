const { GoogleGenAI } = require("@google/genai");

/**
 * REPUTATION ENGINE
 * Analyzes market sentiment using Gemini
 */
class ReviewService {
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeSentiment(content) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the sentiment of this product review and return ONLY the word "positive", "neutral", or "negative": "${content}"`,
      });
      return response.text.trim().toLowerCase();
    } catch (err) {
      return 'neutral'; // Fallback protocol
    }
  }

  async submitReview(userId, productId, data) {
    const sentiment = await this.analyzeSentiment(data.content);
    const review = {
      ...data,
      userId,
      productId,
      sentiment,
      status: 'approved', // Auto-approval for verified architects
      createdAt: new Date()
    };
    // Persist to DB logic here
    return review;
  }
}

module.exports = new ReviewService();