import { FastifyInstance } from 'fastify';
import { register, login, refresh, me, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', register);
  fastify.post('/login', login);
  fastify.post('/refresh', refresh);
  fastify.get('/me', { preHandler: [verifyJWT] }, me);
  fastify.get('/profile', { preHandler: [verifyJWT] }, getProfile);
  fastify.put('/profile', { preHandler: [verifyJWT] }, updateProfile);
}
