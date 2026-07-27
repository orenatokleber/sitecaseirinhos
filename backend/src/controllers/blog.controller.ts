import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../lib/prisma.js';

// ============ POSTS ============
export async function getPosts(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { publishedOnly?: string };
  const publishedOnly = query.publishedOnly !== 'false'; // default true

  const posts = await prisma.blogPost.findMany({
    where: publishedOnly ? { isPublished: true } : {},
    orderBy: { publishedAt: 'desc' },
  });

  return reply.send(posts);
}

export async function getPostBySlug(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = request.params as { slug: string };

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!post) {
    return reply.status(404).send({ error: 'Post não encontrado.' });
  }

  return reply.send(post);
}

export async function upsertPost(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  const { id, title, slug, content, excerpt, cover_image, author_name, category, tags, reading_time_min, allow_comments, is_published, published_at, sort_order } = body;

  const data = {
    title: title.trim(),
    slug: slug.trim(),
    content: content,
    excerpt: excerpt || null,
    coverImage: cover_image || null,
    authorName: author_name || 'Caseirinhos',
    category: category || null,
    tags: tags || null,
    readingTimeMin: reading_time_min ? parseInt(reading_time_min) : null,
    allowComments: allow_comments !== undefined ? Boolean(allow_comments) : true,
    isPublished: is_published !== undefined ? Boolean(is_published) : false,
    publishedAt: published_at ? new Date(published_at) : (is_published ? new Date() : null),
    sortOrder: sort_order ? parseInt(sort_order) : 0,
  };

  if (id) {
    const updated = await prisma.blogPost.update({
      where: { id },
      data,
    });
    return reply.send(updated);
  } else {
    const created = await prisma.blogPost.create({
      data,
    });
    return reply.status(201).send(created);
  }
}

export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.blogPost.delete({ where: { id } });
  return reply.send({ success: true });
}

// ============ COMMENTS ============
export async function getComments(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { approvedOnly?: string; postId?: string };
  const approvedOnly = query.approvedOnly === 'true';
  const postId = query.postId;

  const comments = await prisma.blogComment.findMany({
    where: {
      ...(approvedOnly ? { isApproved: true } : {}),
      ...(postId ? { postId } : {}),
    },
    include: {
      post: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatted = comments.map((c) => ({
    id: c.id,
    post_id: c.postId,
    author_name: c.authorName,
    content: c.content,
    is_approved: c.isApproved,
    created_at: c.createdAt,
    blog_posts: c.post,
  }));

  return reply.send(formatted);
}

export async function createComment(request: FastifyRequest, reply: FastifyReply) {
  const { postId, authorName, content } = request.body as {
    postId: string;
    authorName: string;
    content: string;
  };

  const comment = await prisma.blogComment.create({
    data: {
      postId,
      authorName: authorName.trim(),
      content: content.trim(),
      isApproved: false, // Moderation required
    },
  });

  return reply.status(201).send(comment);
}

export async function updateComment(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { is_approved } = request.body as { is_approved: boolean };

  const updated = await prisma.blogComment.update({
    where: { id },
    data: {
      isApproved: Boolean(is_approved),
    },
  });

  return reply.send(updated);
}

export async function deleteComment(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await prisma.blogComment.delete({ where: { id } });
  return reply.send({ success: true });
}
