const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * STRIPE NUCLEUS
 */
class StripeService {
  async createPaymentIntent(amount, currency = 'usd') {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });
  }

  async handleWebhook(event) {
    // Process async payment status updates
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Signal order completion
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}

module.exports = new StripeService();