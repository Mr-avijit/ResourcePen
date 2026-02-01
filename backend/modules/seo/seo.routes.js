const express = require('express');
const router = express.Router();
const SEOService = require('./seo.service');
const { success, error } = require('../../core/responses');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../core/guards');

/**
 * POST /api/v1/seo/synthesize
 * Restricted to: Admin, Architect roles
 */
router.post('/synthesize', authenticate, checkPermission('admin'), async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return error(res, 'Description payload required for synthesis.', 400, 'PAYLOAD_MISSING');
    }

    const keywords = await SEOService.synthesizeKeywords(description);
    return success(res, { keywords }, 'Neural SEO synthesis complete.');
  } catch (err) {
    return error(res, err.message, 500, 'NEURAL_LINK_FAULT');
  }
});

module.exports = router;