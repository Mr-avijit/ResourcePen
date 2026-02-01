const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../core/guards');

router.get('/config', async (req, res) => {
  const CMSService = require('./cms.service');
  const config = await CMSService.getConfig();
  res.json(config);
});

router.put('/config', authenticate, checkPermission('manage_cms'), async (req, res) => {
  const CMSService = require('./cms.service');
  const updated = await CMSService.updateConfig(req.body);
  res.json(updated);
});

module.exports = router;