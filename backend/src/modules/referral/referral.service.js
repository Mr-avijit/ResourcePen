class ReferralService {
  async trackReferral(referralCode, targetUserId) {
    // Logic to associate click and conversion to advocate
    return { success: true, timestamp: new Date() };
  }

  async calculateCommission(orderAmount, tier) {
    const rates = { rising: 0.15, pro: 0.20, elite: 0.30 };
    return orderAmount * (rates[tier] || 0.10);
  }
}

module.exports = new ReferralService();