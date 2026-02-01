/**
 * FISCAL COMMAND CONTROLLER
 */
class OrderController {
  async createOrder(req, res) {
    const { items, couponCode } = req.body;
    res.json({
      orderId: `ORD-${Date.now()}`,
      status: 'pending_settlement',
      message: 'Checkout initialized in ledger.'
    });
  }

  async getInvoice(req, res) {
    res.json({ message: "Forensic invoice generated." });
  }
}

module.exports = new OrderController();