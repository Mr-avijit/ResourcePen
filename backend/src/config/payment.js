/**
 * FISCAL GATEWAY CONFIG
 * Orchestrates Stripe and Razorpay integrations
 */
module.exports = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  },
  currency: 'USD',
  taxRate: 0.18 // Standard platform tax
};