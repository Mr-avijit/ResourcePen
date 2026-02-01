import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { SEOController } from '../controllers/seo.controller';
import { AIService } from '../services/ai.service';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// --- PUBLIC NODES ---
router.get('/health', (req, res) => res.json({ status: 'Operational', pulse: Date.now() }));
router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getById);

// --- IDENTITY PROTECTED NODES ---
router.post('/products', authenticate, authorize(['admin']), ProductController.create);

// --- NEURAL NODES ---
router.post('/seo/synthesize', authenticate, authorize(['admin']), SEOController.synthesize);
router.get('/seo/rules', authenticate, authorize(['admin']), SEOController.getRules);

router.post('/support/chat', authenticate, async (req: any, res) => {
  const { message, history } = req.body;
  const reply = await AIService.generateSupportResponse(history || [], message);
  res.json({ success: true, text: reply });
});

// --- FISCAL NODES (MOCK) ---
router.get('/finance/stats', authenticate, authorize(['admin']), (req, res) => {
  res.json({ success: true, data: { revenue: 842590, sales: 1242 } });
});

export default router;
