import { FastifyInstance } from 'fastify';
import { uploadImage } from '../controllers/upload.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.middleware.js';

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post('/upload', {
    preHandler: [verifyJWT, requireRole(['admin', 'editor'])]
  }, uploadImage);
}
