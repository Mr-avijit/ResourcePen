/**
 * FISCAL LEDGER SERVICE
 */
class OrderService {
  async create(userId, items, couponId) {
    const orderId = `ORD-${Date.now()}`;
    // Reconcile prices, apply coupons, record in transactions
    return { orderId, status: 'pending_payment' };
  }

  async getHistory(userId) {
    // Pull from orders_archive
    return [];
  }
}

module.exports = new OrderService();