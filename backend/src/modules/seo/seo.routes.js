const express = require('express');
const router = express.Router();
const SEOService = require('./seo.service');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../core/guards');

router.post('/synthesize', authenticate, checkPermission('manage_seo'), async (req, res) => {
  try {
    const keywords = await SEOService.synthesizeKeywords(req.body.description);
    res.json({ keywords });
  } catch (err) {
    res.status(500).json({ error: "Neural link timeout." });
  }
});

module.exports = router;