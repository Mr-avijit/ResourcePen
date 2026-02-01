const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../core/guards');
const AnalyticsService = require('./analytics.service');

router.get('/insights', authenticate, checkPermission('access_admin_dashboard'), async (req, res) => {
  const stats = await AnalyticsService.getPlatformStats();
  const insight = await AnalyticsService.generateExecutiveInsight(stats);
  res.json({ stats, insight });
});

module.exports = router;