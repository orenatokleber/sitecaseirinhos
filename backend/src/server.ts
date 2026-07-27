import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load env variables
dotenv.config();

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({
  logger: true,
});

// Create uploads folder if not exists
const uploadsDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Register plugins
await app.register(cors, {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  credentials: true,
});

await app.register(helmet, {
  contentSecurityPolicy: false, // Turn off CSP for dev convenience
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

await app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'caseirinhos-super-secret-key-123456',
});

// Serve uploaded files statically
await app.register(fastifyStatic, {
  root: uploadsDir,
  prefix: '/uploads/',
});

// Health check
app.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// Route imports
import authRoutes from './routes/auth.routes.js';
import cardapioRoutes from './routes/cardapio.routes.js';
import blogRoutes from './routes/blog.routes.js';
import siteRoutes from './routes/site.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Route registrations
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(cardapioRoutes, { prefix: '/api/cardapio' });
await app.register(blogRoutes, { prefix: '/api/blog' });
await app.register(siteRoutes, { prefix: '/api/site' });
await app.register(uploadRoutes, { prefix: '/api' }); // prefixes '/upload' to '/api/upload'

// Run server
const port = parseInt(process.env.PORT || '3001');
const host = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await app.listen({ port, host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
