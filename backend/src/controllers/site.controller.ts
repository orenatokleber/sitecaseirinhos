import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../lib/prisma.js';

// ============ PRODUCTS ============
export async function getProducts(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string; featuredOnly?: string };
  const activeOnly = query.activeOnly === 'true';
  const featuredOnly = query.featuredOnly === 'true';

  const products = await prisma.product.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(featuredOnly ? { isFeatured: true } : {}),
    },
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image_url: p.imageUrl,
      category: p.category,
      is_featured: p.isFeatured,
      is_active: p.isActive,
      sort_order: p.sortOrder,
    }))
  );
}

export async function upsertProduct(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, name, description, price, image_url, category, is_featured, is_active, sort_order } = body;

  const data = {
    name: name.trim(),
    description: description || null,
    price: price ? parseFloat(price) : null,
    imageUrl: image_url || null,
    category: category.trim(),
    isFeatured: is_featured !== undefined ? Boolean(is_featured) : false,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
  };

  if (id) {
    const updated = await prisma.product.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.product.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.product.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ TESTIMONIALS ============
export async function getTestimonials(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const testimonials = await prisma.testimonial.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      content: t.content,
      stars: t.stars,
      is_active: t.isActive,
      sort_order: t.sortOrder,
    }))
  );
}

export async function upsertTestimonial(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, name, content, stars, is_active, sort_order } = body;

  const data = {
    name: name.trim(),
    content: content.trim(),
    stars: stars ? parseInt(stars) : 5,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
  };

  if (id) {
    const updated = await prisma.testimonial.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.testimonial.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteTestimonial(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.testimonial.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ GALLERY IMAGES ============
export async function getGalleryImages(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const images = await prisma.galleryImage.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    images.map((img) => ({
      id: img.id,
      title: img.title,
      alt_text: img.altText,
      image_url: img.imageUrl,
      category: img.category,
      sort_order: img.sortOrder,
      is_active: img.isActive,
    }))
  );
}

export async function upsertGalleryImage(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, title, alt_text, image_url, category, sort_order, is_active } = body;

  const data = {
    title: title || null,
    altText: alt_text || null,
    imageUrl: image_url,
    category: category || null,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.galleryImage.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.galleryImage.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteGalleryImage(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.galleryImage.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ DELIVERY POPUPS ============
export async function getDeliveryPopups(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { activeOnly?: string };
  const activeOnly = query.activeOnly === 'true';

  const popups = await prisma.deliveryPopup.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
  });

  return reply.send(
    popups.map((p) => ({
      id: p.id,
      popup_type: p.popupType,
      title: p.title,
      description: p.description,
      discount_text: p.discountText,
      coupon_code: p.couponCode,
      image_url: p.imageUrl,
      bg_color: p.bgColor,
      text_color: p.textColor,
      is_active: p.isActive,
      sort_order: p.sortOrder,
    }))
  );
}

export async function upsertDeliveryPopup(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, popup_type, title, description, discount_text, coupon_code, image_url, bg_color, text_color, is_active, sort_order } = body;

  const data = {
    popupType: popup_type || 'general',
    title: title.trim(),
    description: description || null,
    discountText: discount_text || null,
    couponCode: coupon_code || null,
    imageUrl: image_url || null,
    bgColor: bg_color || null,
    textColor: text_color || null,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
    sortOrder: sort_order ? parseInt(sort_order) : 0,
  };

  if (id) {
    const updated = await prisma.deliveryPopup.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.deliveryPopup.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteDeliveryPopup(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.deliveryPopup.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ REDIRECTS ============
export async function getRedirects(request: FastifyRequest, reply: FastifyReply) {
  const redirects = await prisma.redirect.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return reply.send(
    redirects.map((r) => ({
      id: r.id,
      slug: r.slug,
      destination_url: r.destinationUrl,
      title: r.title,
      total_clicks: r.totalClicks,
      is_active: r.isActive,
      created_at: r.createdAt,
    }))
  );
}

export async function getRedirectBySlug(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = request.params as { slug: string };

  const redirect = await prisma.redirect.findUnique({
    where: { slug, isActive: true },
  });

  if (!redirect) {
    return reply.status(404).send({ error: 'Redirecionamento não encontrado ou inativo.' });
  }

  // Increment click asynchronously
  const userAgent = request.headers['user-agent'] || null;
  const referrer = (request.query as any).ref || request.headers['referer'] || null;

  // Run in background without blocking response
  prisma.redirectClick
    .create({
      data: {
        redirectId: redirect.id,
        userAgent,
        referrer,
      },
    })
    .then(async () => {
      await prisma.redirect.update({
        where: { id: redirect.id },
        data: { totalClicks: { increment: 1 } },
      });
    })
    .catch((err) => console.error('Error tracking click:', err));

  return reply.send({ destination_url: redirect.destinationUrl });
}

export async function upsertRedirect(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, slug, destination_url, title, is_active } = body;

  const data = {
    slug: slug.trim(),
    destinationUrl: destination_url.trim(),
    title: title || null,
    isActive: is_active !== undefined ? Boolean(is_active) : true,
  };

  if (id) {
    const updated = await prisma.redirect.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.redirect.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deleteRedirect(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.redirect.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ SITE SECTIONS ============
export async function getSections(request: FastifyRequest, reply: FastifyReply) {
  const sections = await prisma.siteSection.findMany();
  return reply.send(
    sections.map((s) => ({
      id: s.id,
      section_key: s.sectionKey,
      title: s.title,
      subtitle: s.subtitle,
      content: s.content,
      image_url: s.imageUrl,
      cta_text: s.ctaText,
      cta_link: s.ctaLink,
      metadata: s.metadata,
      updated_at: s.updatedAt,
    }))
  );
}

export async function upsertSection(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, section_key, title, subtitle, content, image_url, cta_text, cta_link, metadata } = body;

  const data = {
    sectionKey: section_key.trim(),
    title: title || null,
    subtitle: subtitle || null,
    content: content || null,
    imageUrl: image_url || null,
    ctaText: cta_text || null,
    ctaLink: cta_link || null,
    metadata: metadata || null,
  };

  if (id) {
    const updated = await prisma.siteSection.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.siteSection.upsert({
      where: { sectionKey: section_key },
      update: data,
      create: data,
    });
    return reply.send(created);
  }
}

// ============ SITE SETTINGS ============
export async function getSettings(request: FastifyRequest, reply: FastifyReply) {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, any> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }
  return reply.send(settingsMap);
}

export async function upsertSetting(request: FastifyRequest, reply: FastifyReply) {
  const { key, value } = request.body as { key: string; value: any };

  const updated = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return reply.send(updated);
}

// ============ ANALYTICS & STATS ============
export async function trackPageView(request: FastifyRequest, reply: FastifyReply) {
  const { page_path, page_title, referrer } = request.body as {
    page_path: string;
    page_title?: string;
    referrer?: string;
  };

  const userAgent = request.headers['user-agent'] || null;

  const view = await prisma.pageView.create({
    data: {
      pagePath: page_path,
      pageTitle: page_title || null,
      referrer: referrer || null,
      userAgent,
    },
  });

  return reply.status(201).send(view);
}

export async function getAdminStats(request: FastifyRequest, reply: FastifyReply) {
  const totalPageViews = await prisma.pageView.count();
  const totalRedirectClicks = await prisma.redirectClick.count();
  const totalProducts = await prisma.product.count();
  const totalBlogPosts = await prisma.blogPost.count();
  const totalComments = await prisma.blogComment.count();

  // Get view counts grouped by page path
  const viewsByPath = await prisma.pageView.groupBy({
    by: ['pagePath'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 10,
  });

  // Get click counts grouped by redirect slug
  const clicksByRedirect = await prisma.redirect.findMany({
    select: {
      slug: true,
      totalClicks: true,
    },
    orderBy: {
      totalClicks: 'desc',
    },
    take: 10,
  });

  return reply.send({
    summary: {
      page_views: totalPageViews,
      redirect_clicks: totalRedirectClicks,
      products: totalProducts,
      blog_posts: totalBlogPosts,
      comments: totalComments,
    },
    popular_pages: viewsByPath.map((v) => ({
      path: v.pagePath,
      count: v._count.id,
    })),
    popular_redirects: clicksByRedirect.map((c) => ({
      slug: c.slug,
      count: c.totalClicks,
    })),
  });
}

export async function getPageViews(request: FastifyRequest, reply: FastifyReply) {
  try {
    const views = await prisma.pageView.findMany({
      orderBy: { viewedAt: 'desc' },
      take: 1000,
    });
    return reply.send(
      views.map((v) => ({
        id: v.id,
        page_path: v.pagePath,
        page_title: v.pageTitle,
        referrer: v.referrer,
        user_agent: v.userAgent,
        viewed_at: v.viewedAt,
      }))
    );
  } catch (err) {
    console.error('getPageViews error:', err);
    return reply.status(500).send({ error: 'Erro ao buscar visualizações de páginas.' });
  }
}

export async function generateBlogPost(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { topic, keywords, tone, length, generateImage } = request.body as any;

    const title = `Tudo sobre: ${topic}`;
    const slug = topic
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const excerpt = `Descubra as principais dicas e segredos sobre ${topic} nesta matéria completa elaborada pela nossa equipe.`;

    return reply.send({
      title,
      slug,
      excerpt,
      category: 'Dicas',
      tags: keywords ? keywords.split(',').map((k: string) => k.trim()) : ['confeitaria', 'dicas'],
      blocks: [
        {
          type: 'heading2',
          content: `Introdução ao tema: ${topic}`,
        },
        {
          type: 'paragraph',
          content: `Se você está buscando entender mais sobre ${topic}, chegou ao lugar certo. Neste artigo, vamos explorar os conceitos mais importantes e trazer dicas práticas que você pode aplicar no seu dia a dia de forma simples e rápida. A confeitaria artesanal é repleta de detalhes fascinantes!`,
        },
        {
          type: 'callout',
          content: `Dica de ouro: O principal segredo para dominar isso está na paciência e na escolha de ingredientes de alta qualidade!`,
          calloutType: 'info',
        },
        {
          type: 'paragraph',
          content: `Esperamos que este conteúdo tenha sido útil para você. Experimente colocar em prática e compartilhe os resultados conosco!`,
        }
      ],
      seo_score_tips: [
        'Use a palavra-chave principal no título e na introdução.',
        'Mantenha os parágrafos curtos para facilitar a leitura.',
        'Adicione imagens explicativas com textos alternativos (alt text).'
      ],
      generated_image: null,
    });
  } catch (err) {
    console.error('generateBlogPost error:', err);
    return reply.status(500).send({ error: 'Erro ao gerar post via IA.' });
  }
}
