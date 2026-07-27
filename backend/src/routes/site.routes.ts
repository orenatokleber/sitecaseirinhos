import { FastifyInstance } from 'fastify';
import {
  getProducts, upsertProduct, deleteProduct,
  getTestimonials, upsertTestimonial, deleteTestimonial,
  getGalleryImages, upsertGalleryImage, deleteGalleryImage,
  getDeliveryPopups, upsertDeliveryPopup, deleteDeliveryPopup,
  getRedirects, getRedirectBySlug, upsertRedirect, deleteRedirect,
  getSections, upsertSection,
  getSettings, upsertSetting,
  trackPageView, getAdminStats, getPageViews, generateBlogPost
} from '../controllers/site.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.middleware.js';

export default async function siteRoutes(fastify: FastifyInstance) {
  const adminHandlers = { preHandler: [verifyJWT, requireRole(['admin', 'editor'])] };

  // Products
  fastify.get('/products', getProducts);
  fastify.post('/products', adminHandlers, upsertProduct);
  fastify.delete('/products/:id', adminHandlers, deleteProduct);

  // Testimonials
  fastify.get('/testimonials', getTestimonials);
  fastify.post('/testimonials', adminHandlers, upsertTestimonial);
  fastify.delete('/testimonials/:id', adminHandlers, deleteTestimonial);

  // Gallery
  fastify.get('/gallery', getGalleryImages);
  fastify.post('/gallery', adminHandlers, upsertGalleryImage);
  fastify.delete('/gallery/:id', adminHandlers, deleteGalleryImage);

  // Popups
  fastify.get('/popups', getDeliveryPopups);
  fastify.post('/popups', adminHandlers, upsertDeliveryPopup);
  fastify.delete('/popups/:id', adminHandlers, deleteDeliveryPopup);

  // Redirects (Public lookup & admin CRUD)
  fastify.get('/redirects', adminHandlers, getRedirects);
  fastify.get('/r/:slug', getRedirectBySlug);
  fastify.post('/redirects', adminHandlers, upsertRedirect);
  fastify.delete('/redirects/:id', adminHandlers, deleteRedirect);

  // Sections & Settings
  fastify.get('/sections', getSections);
  fastify.post('/sections', adminHandlers, upsertSection);
  fastify.get('/settings', getSettings);
  fastify.post('/settings', adminHandlers, upsertSetting);

  // Analytics
  fastify.post('/analytics/page-view', trackPageView);
  fastify.get('/analytics/stats', { preHandler: [verifyJWT, requireRole(['admin'])] }, getAdminStats);
  fastify.get('/analytics/page-views', { preHandler: [verifyJWT, requireRole(['admin'])] }, getPageViews);

  // AI Blog Generator
  fastify.post('/blog/generate', adminHandlers, generateBlogPost);
}
