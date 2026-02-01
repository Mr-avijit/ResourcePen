/**
 * SUPPORT TRIAGE CONTROLLER
 */
class SupportController {
  async createTicket(req, res) {
    res.json({ id: `TK-${Date.now()}`, status: 'open', message: 'Transmission received.' });
  }

  async getMessages(req, res) {
    res.json([]);
  }
}

module.exports = new SupportController();