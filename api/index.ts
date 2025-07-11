import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes.js';

// Create Express app
const app = express();

// Initialize routes
let routesInitialized = false;

async function initializeApp() {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
  }
}

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeApp();
    
    // Convert Vercel request to Express request format
    const expressReq = req as any;
    const expressRes = res as any;
    
    // Handle the request with Express
    app(expressReq, expressRes);
  } catch (error) {
    console.error('Vercel function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}