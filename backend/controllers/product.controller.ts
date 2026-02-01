import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

/**
 * ASSET ORCHESTRATOR
 * Manages marketplace catalog and genesis of new digital products.
 */
export class ProductController {
  static async getAll(req: Request, res: Response) {
    // Simulating database manifest retrieval
    const products = [
      { id: 'p-1', name: 'Horizon Dashboard Pro', status: 'active', price: 149, category: 'SaaS Dashboard' },
      { id: 'p-2', name: 'CryptoNext v2', status: 'active', price: 199, category: 'Web3 Interface' }
    ];
    res.json({ success: true, data: products });
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const id = `p-${Date.now()}`;
      
      // Background task: Synthesize SEO metadata if description exists
      if (data.description) {
        AIService.synthesizeSEO(data.description).then(keywords => {
          console.log(`[SEO_ENGINE] Meta synthesized for ${id}:`, keywords);
        });
      }

      res.status(201).json({ success: true, message: "Genesis successful.", data: { id, ...data } });
    } catch (err) {
      res.status(400).json({ success: false, error: "Product genesis failed." });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.json({ success: true, data: { id, name: 'Sample Product Node' } });
  }
}
