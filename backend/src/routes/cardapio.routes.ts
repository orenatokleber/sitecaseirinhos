import { FastifyInstance } from 'fastify';
import {
  getSizes, upsertSize, deleteSize,
  getCategories, upsertCategory, deleteCategory,
  getPrices, upsertPrice,
  getFlavors, upsertFlavor, deleteFlavor,
  getRectangular, upsertRectangular, deleteRectangular,
  getDecorations, upsertDecoration, deleteDecoration,
  getSweetTypes, upsertSweetType, deleteSweetType,
  getSweetFlavors, upsertSweetFlavor, deleteSweetFlavor,
  getSweetPackages, upsertSweetPackage, deleteSweetPackage,
  getCakeAddons, upsertCakeAddon, deleteCakeAddon,
  getCakeAddonPrices, upsertCakeAddonPrice
} from '../controllers/cardapio.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.middleware.js';

export default async function cardapioRoutes(fastify: FastifyInstance) {
  const adminHandlers = { preHandler: [verifyJWT, requireRole(['admin', 'editor'])] };

  // Sizes
  fastify.get('/sizes', getSizes);
  fastify.post('/sizes', adminHandlers, upsertSize);
  fastify.delete('/sizes/:id', adminHandlers, deleteSize);

  // Categories
  fastify.get('/categories', getCategories);
  fastify.post('/categories', adminHandlers, upsertCategory);
  fastify.delete('/categories/:id', adminHandlers, deleteCategory);

  // Prices
  fastify.get('/prices', getPrices);
  fastify.post('/prices', adminHandlers, upsertPrice);

  // Flavors
  fastify.get('/flavors', getFlavors);
  fastify.post('/flavors', adminHandlers, upsertFlavor);
  fastify.delete('/flavors/:id', adminHandlers, deleteFlavor);

  // Rectangular
  fastify.get('/rectangular', getRectangular);
  fastify.post('/rectangular', adminHandlers, upsertRectangular);
  fastify.delete('/rectangular/:id', adminHandlers, deleteRectangular);

  // Decorations
  fastify.get('/decorations', getDecorations);
  fastify.post('/decorations', adminHandlers, upsertDecoration);
  fastify.delete('/decorations/:id', adminHandlers, deleteDecoration);

  // Sweet Types
  fastify.get('/sweet-types', getSweetTypes);
  fastify.post('/sweet-types', adminHandlers, upsertSweetType);
  fastify.delete('/sweet-types/:id', adminHandlers, deleteSweetType);

  // Sweet Flavors
  fastify.get('/sweet-flavors', getSweetFlavors);
  fastify.post('/sweet-flavors', adminHandlers, upsertSweetFlavor);
  fastify.delete('/sweet-flavors/:id', adminHandlers, deleteSweetFlavor);

  // Sweet Packages
  fastify.get('/sweet-packages', getSweetPackages);
  fastify.post('/sweet-packages', adminHandlers, upsertSweetPackage);
  fastify.delete('/sweet-packages/:id', adminHandlers, deleteSweetPackage);

  // Cake Addons
  fastify.get('/addons', getCakeAddons);
  fastify.post('/addons', adminHandlers, upsertCakeAddon);
  fastify.delete('/addons/:id', adminHandlers, deleteCakeAddon);

  // Cake Addon Prices
  fastify.get('/addon-prices', getCakeAddonPrices);
  fastify.post('/addon-prices', adminHandlers, upsertCakeAddonPrice);
}
