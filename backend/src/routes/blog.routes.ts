import { FastifyInstance } from 'fastify';
import {
  getPosts, getPostBySlug, upsertPost, deletePost,
  getComments, createComment, updateComment, deleteComment
} from '../controllers/blog.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.middleware.js';

export default async function blogRoutes(fastify: FastifyInstance) {
  const adminHandlers = { preHandler: [verifyJWT, requireRole(['admin', 'editor'])] };

  // Posts
  fastify.get('/posts', getPosts);
  fastify.get('/posts/:slug', getPostBySlug);
  fastify.post('/posts', adminHandlers, upsertPost);
  fastify.delete('/posts/:id', adminHandlers, deletePost);

  // Comments
  fastify.get('/comments', getComments);
  fastify.post('/comments', createComment);
  fastify.put('/comments/:id', adminHandlers, updateComment);
  fastify.delete('/comments/:id', adminHandlers, deleteComment);
}
