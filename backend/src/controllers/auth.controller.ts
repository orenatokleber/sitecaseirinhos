import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { TokenPayload } from '../middlewares/auth.middleware.js';

// Schemas
const registerSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  displayName: z.string().min(2, 'Nome muito curto').optional(),
});

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh Token obrigatório'),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password, displayName } = registerSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: 'Este e-mail já está cadastrado.' });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roles: {
          create: { role: 'user' },
        },
        profile: {
          create: {
            displayName: displayName || email.split('@')[0],
          },
        },
      },
      include: {
        roles: true,
        profile: true,
      },
    });

    const accessToken = await reply.jwtSign(
      { email: user.email },
      { sign: { sub: user.id, expiresIn: '15m' } }
    );

    const refreshToken = await reply.jwtSign(
      { email: user.email, isRefresh: true },
      { sign: { sub: user.id, expiresIn: '7d' } }
    );

    return reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName,
        avatarUrl: user.profile?.avatarUrl,
        roles: user.roles.map((r) => r.role),
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    return reply.status(500).send({ error: 'Erro interno do servidor.' });
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
        profile: true,
      },
    });

    if (!user) {
      return reply.status(400).send({ error: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return reply.status(400).send({ error: 'Credenciais inválidas.' });
    }

    const accessToken = await reply.jwtSign(
      { email: user.email },
      { sign: { sub: user.id, expiresIn: '15m' } }
    );

    const refreshToken = await reply.jwtSign(
      { email: user.email, isRefresh: true },
      { sign: { sub: user.id, expiresIn: '7d' } }
    );

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName,
        avatarUrl: user.profile?.avatarUrl,
        roles: user.roles.map((r) => r.role),
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    return reply.status(500).send({ error: 'Erro interno do servidor.' });
  }
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { refreshToken } = refreshSchema.parse(request.body);

    // Verify token structure
    const decoded = request.server.jwt.verify(refreshToken) as TokenPayload & { isRefresh?: boolean };
    
    if (!decoded || !decoded.isRefresh) {
      return reply.status(400).send({ error: 'Refresh token inválido.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: {
        roles: true,
        profile: true,
      },
    });

    if (!user) {
      return reply.status(400).send({ error: 'Usuário não encontrado.' });
    }

    const newAccessToken = await reply.jwtSign(
      { email: user.email },
      { sign: { sub: user.id, expiresIn: '15m' } }
    );

    const newRefreshToken = await reply.jwtSign(
      { email: user.email, isRefresh: true },
      { sign: { sub: user.id, expiresIn: '7d' } }
    );

    return reply.send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors[0].message });
    }
    return reply.status(401).send({ error: 'Refresh token inválido ou expirado.' });
  }
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = request.user as TokenPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: true,
        profile: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado.' });
    }

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName,
        avatarUrl: user.profile?.avatarUrl,
        roles: user.roles.map((r) => r.role),
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return reply.status(500).send({ error: 'Erro interno do servidor.' });
  }
}

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = request.user as TokenPayload;
    const profile = await prisma.profile.findUnique({
      where: { userId: payload.sub }
    });
    
    if (!profile) {
      const newProfile = await prisma.profile.create({
        data: {
          userId: payload.sub,
          displayName: payload.email.split('@')[0],
        }
      });
      return reply.send({
        id: newProfile.id,
        user_id: newProfile.userId,
        display_name: newProfile.displayName,
        avatar_url: newProfile.avatarUrl,
        bio: newProfile.bio,
      });
    }

    return reply.send({
      id: profile.id,
      user_id: profile.userId,
      display_name: profile.displayName,
      avatar_url: profile.avatarUrl,
      bio: profile.bio,
    });
  } catch (err) {
    console.error('getProfile error:', err);
    return reply.status(500).send({ error: 'Erro ao buscar perfil.' });
  }
}

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = request.user as TokenPayload;
    const body = request.body as { display_name?: string; bio?: string; avatar_url?: string };

    const updated = await prisma.profile.upsert({
      where: { userId: payload.sub },
      update: {
        displayName: body.display_name,
        bio: body.bio,
        avatarUrl: body.avatar_url,
      },
      create: {
        userId: payload.sub,
        displayName: body.display_name || payload.email.split('@')[0],
        bio: body.bio || null,
        avatarUrl: body.avatar_url || null,
      }
    });

    return reply.send({
      id: updated.id,
      user_id: updated.userId,
      display_name: updated.displayName,
      avatar_url: updated.avatarUrl,
      bio: updated.bio,
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    return reply.status(500).send({ error: 'Erro ao atualizar perfil.' });
  }
}
