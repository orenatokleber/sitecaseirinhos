import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../lib/prisma.js';

export interface TokenPayload {
  sub: string;
  email: string;
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ error: 'Não autorizado. Token inválido ou expirado.' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Ensure request.user is set by jwtVerify
    if (!request.user) {
      return reply.status(401).send({ error: 'Não autorizado.' });
    }

    const payload = request.user as TokenPayload;
    
    // Fetch user roles
    const userRoles = await prisma.userRole.findMany({
      where: { userId: payload.sub },
      select: { role: true },
    });

    const roles = userRoles.map((ur) => ur.role);
    const hasPermission = roles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return reply.status(403).send({ error: 'Acesso negado. Permissão insuficiente.' });
    }
  };
}
