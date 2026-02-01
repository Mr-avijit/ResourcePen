import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/index';

const app = express();

// Security Hardening Layer
app.use(helmet());
app.use(cors());
app.use(express.json());

// Global Logic Trace
app.use((req, res, next) => {
  console.log(`[RESOURCES_PEN_API] ${req.method} ${req.path} | ${new Date().toISOString()}`);
  next();
});

// Routing Layer
app.use('/api/v1', apiRoutes);

// Fault Exception Node
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[CRITICAL_FAULT]', err);
  res.status(500).json({ 
    success: false, 
    error: "Internal protocol failure.", 
    code: "GENESIS_NODE_ERROR" 
  });
});

export default app;
