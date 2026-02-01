class CartService {
  async add(userId, productId, quantity = 1) {
    // Reconcile with inventory levels
    return { userId, productId, quantity, timestamp: Date.now() };
  }

  async remove(userId, productId) {
    // Removal logic from session or DB
    return true;
  }

  async calculateTotal(items) {
    // Apply platform tax (18%) and item prices
    const subtotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
    return { subtotal, tax: subtotal * 0.18, total: subtotal * 1.18 };
  }
}

module.exports = new CartService();