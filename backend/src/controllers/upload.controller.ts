import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'Nenhum arquivo enviado.' });
    }

    // Accept only image files
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const fileExt = path.extname(data.filename).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
      return reply.status(400).send({ error: 'Apenas arquivos de imagem são permitidos.' });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    await pump(data.file, fs.createWriteStream(filePath));

    return reply.send({
      fileName,
      url: `/uploads/${fileName}`,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return reply.status(500).send({ error: 'Erro ao fazer upload do arquivo.' });
  }
}
