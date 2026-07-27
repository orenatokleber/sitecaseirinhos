import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../lib/prisma.js';

// ============ SIZES ============
export async function getSizes(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const sizes = await prisma.cakeSize.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  // Map snake_case response for frontend compat
  return reply.send(
    sizes.map((s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      ring_size: s.ringSize,
      slices: s.slices,
      weight_kg: s.weightKg,
      sort_order: s.sortOrder,
      is_active: s.isActive,
    }))
  );
}

export async function upsertSize(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, code, name, ring_size, slices, weight_kg, sort_order, is_active } = body;

  const data = {
    code: code.trim(),
    name: (name || code).trim(),
    ringSize: ring_size,
    slices: slices ? parseInt(slices) : null,
    weightKg: weight_kg ? parseFloat(weight_kg) : null,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.cakeSize.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.cakeSize.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteSize(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.cakeSize.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ CATEGORIES ============
export async function getCategories(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const categories = await prisma.cakeCategory.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      type: c.type,
      image_url: c.imageUrl,
      sort_order: c.sortOrder,
      is_active: c.isActive,
    }))
  );
}

export async function upsertCategory(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, slug, name, description, type, image_url, sort_order, is_active } = body;

  const data = {
    slug: slug.trim(),
    name: name.trim(),
    description: description || null,
    type: type || 'standard',
    imageUrl: image_url || null,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.cakeCategory.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.cakeCategory.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.cakeCategory.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ PRICES ============
export async function getPrices(request: FastifyRequest, reply: FastifyReply) {
  const prices = await prisma.cakeCategoryPrice.findMany();
  return reply.send(
    prices.map((p) => ({
      id: p.id,
      category_id: p.categoryId,
      size_id: p.sizeId,
      price: p.price,
    }))
  );
}

export async function upsertPrice(request: FastifyRequest, reply: FastifyReply) {
  const { category_id, size_id, price } = request.body as {
    category_id: string;
    size_id: string;
    price: number;
  };

  const upserted = await prisma.cakeCategoryPrice.upsert({
    where: {
      categoryId_sizeId: {
        categoryId: category_id,
        sizeId: size_id,
      },
    },
    update: {
      price: parseFloat(price as any),
    },
    create: {
      categoryId: category_id,
      sizeId: size_id,
      price: parseFloat(price as any),
    },
  });

  return reply.send(upserted);
}

// ============ FLAVORS ============
export async function getFlavors(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const flavors = await prisma.cakeFlavor.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    flavors.map((f) => ({
      id: f.id,
      category_id: f.categoryId,
      name: f.name,
      description: f.description,
      sort_order: f.sortOrder,
      is_active: f.isActive,
    }))
  );
}

export async function upsertFlavor(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, category_id, name, description, sort_order, is_active } = body;

  const data = {
    categoryId: category_id,
    name: name.trim(),
    description: description || null,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.cakeFlavor.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.cakeFlavor.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteFlavor(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.cakeFlavor.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ RECTANGULAR ============
export async function getRectangular(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const cakes = await prisma.cakeRectangular.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    cakes.map((c) => ({
      id: c.id,
      name: c.name,
      dimensions: c.dimensions,
      slices: c.slices,
      weight_kg: c.weightKg,
      class1_price: c.class1Price,
      class2_price: c.class2Price,
      note: c.note,
      sort_order: c.sortOrder,
      is_active: c.isActive,
    }))
  );
}

export async function upsertRectangular(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, name, dimensions, slices, weight_kg, class1_price, class2_price, note, sort_order, is_active } = body;

  const data = {
    name: name.trim(),
    dimensions: dimensions || null,
    slices: slices ? parseInt(slices) : null,
    weightKg: weight_kg ? parseFloat(weight_kg) : null,
    class1Price: class1_price ? parseFloat(class1_price) : null,
    class2Price: class2_price ? parseFloat(class2_price) : null,
    note: note || null,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.cakeRectangular.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.cakeRectangular.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteRectangular(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.cakeRectangular.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ DECORATIONS ============
export async function getDecorations(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const decorations = await prisma.cakeDecoration.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    decorations.map((d) => ({
      id: d.id,
      title: d.title,
      image_url: d.imageUrl,
      sort_order: d.sortOrder,
      is_active: d.isActive,
    }))
  );
}

export async function upsertDecoration(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, title, image_url, sort_order, is_active } = body;

  const data = {
    title: title || null,
    imageUrl: image_url,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.cakeDecoration.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.cakeDecoration.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteDecoration(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.cakeDecoration.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ SWEET TYPES ============
export async function getSweetTypes(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const types = await prisma.sweetType.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    types.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      description: t.description,
      weight_g: t.weightG,
      image_url: t.imageUrl,
      sort_order: t.sortOrder,
      is_active: t.isActive,
    }))
  );
}

export async function upsertSweetType(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, slug, name, description, weight_g, image_url, sort_order, is_active } = body;

  const data = {
    slug: slug.trim(),
    name: name.trim(),
    description: description || null,
    weightG: weight_g ? parseInt(weight_g) : null,
    imageUrl: image_url || null,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.sweetType.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.sweetType.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteSweetType(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.sweetType.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ SWEET FLAVORS ============
export async function getSweetFlavors(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const flavors = await prisma.sweetFlavor.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    flavors.map((f) => ({
      id: f.id,
      type_id: f.typeId,
      name: f.name,
      description: f.description,
      sort_order: f.sortOrder,
      is_active: f.isActive,
    }))
  );
}

export async function upsertSweetFlavor(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, type_id, name, description, sort_order, is_active } = body;

  const data = {
    typeId: type_id,
    name: name.trim(),
    description: description || null,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.sweetFlavor.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.sweetFlavor.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteSweetFlavor(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.sweetFlavor.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ SWEET PACKAGES ============
export async function getSweetPackages(request: FastifyRequest, reply: FastifyReply) {
  const packages = await prisma.sweetPackage.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return reply.send(
    packages.map((p) => ({
      id: p.id,
      type_id: p.typeId,
      quantity: p.quantity,
      price: p.price,
      sort_order: p.sortOrder,
    }))
  );
}

export async function upsertSweetPackage(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, type_id, quantity, price, sort_order } = body;

  const data = {
    typeId: type_id,
    quantity: parseInt(quantity),
    price: parseFloat(price),
    sortOrder: sort_order ? parseInt(sort_order) : 0,
  };

  if (id) {
    const updated = await prisma.sweetPackage.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.sweetPackage.upsert({
      where: {
        typeId_quantity: {
          typeId: type_id,
          quantity: parseInt(quantity),
        },
      },
      update: {
        price: parseFloat(price),
        sortOrder: sort_order ? parseInt(sort_order) : 0,
      },
      create: data,
    });
    return reply.send(created);
  }
}

export async function deleteSweetPackage(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.sweetPackage.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ CAKE ADDONS ============
export async function getCakeAddons(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const addons = await prisma.cakeAddon.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    addons.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      pricing_type: a.pricingType,
      applies_to: a.appliesTo,
      sort_order: a.sortOrder,
      is_active: a.isActive,
    }))
  );
}

export async function upsertCakeAddon(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, name, description, pricing_type, applies_to, sort_order, is_active } = body;

  const data = {
    name: name.trim(),
    description: description || null,
    pricingType: pricing_type || 'fixed',
    appliesTo: applies_to || 'all',
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.cakeAddon.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.cakeAddon.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteCakeAddon(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.cakeAddon.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ CAKE ADDON PRICES ============
export async function getCakeAddonPrices(request: FastifyRequest, reply: FastifyReply) {
  const prices = await prisma.cakeAddonPrice.findMany();
  return reply.send(
    prices.map((p) => ({
      id: p.id,
      addon_id: p.addonId,
      size_id: p.sizeId,
      price: p.price,
    }))
  );
}

export async function upsertCakeAddonPrice(request: FastifyRequest, reply: FastifyReply) {
  const { addon_id, size_id, price } = request.body as {
    addon_id: string;
    size_id: string | null;
    price: number;
  };

  // Delete existing price for the same addon/size combination
  if (size_id === null) {
    await prisma.cakeAddonPrice.deleteMany({
      where: { addonId: addon_id, sizeId: null },
    });
  } else {
    await prisma.cakeAddonPrice.deleteMany({
      where: { addonId: addon_id, sizeId: size_id },
    });
  }

  const created = await prisma.cakeAddonPrice.create({
    data: {
      addonId: addon_id,
      sizeId: size_id,
      price: parseFloat(price as any),
    },
  });

  return reply.send(created);
}
