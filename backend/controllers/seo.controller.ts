import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export class SEOController {
  static async synthesize(req: Request, res: Response) {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: "Description payload required for synthesis." });
    }

    try {
      const keywords = await AIService.synthesizeSEO(description);
      res.json({ success: true, data: { keywords } });
    } catch (err) {
      res.status(500).json({ error: "Neural engine timeout." });
    }
  }

  static async getRules(req: Request, res: Response) {
    const rules = [
      { id: 'r1', name: 'Auto-Index New Assets', status: 'active', priority: 'high' }
    ];
    res.json({ success: true, data: rules });
  }
}
