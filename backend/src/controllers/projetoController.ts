import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'
import {
  createProjetoSchema,
  updateProjetoSchema,
  deleteProjetoSchema,
  vincularParticipanteSchema,
} from '../validators/projetoValidator'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createProjetoHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      tipo,
      status,
      coordenadorId,
    } = createProjetoSchema.parse(request.body)

    const coordenadorExists = await prisma.user.findUnique({
      where: { id: coordenadorId, role: 'COORDENADOR' },
    })
    if (!coordenadorExists) {
      return reply.status(400).send({ error: 'Coordenador não encontrado' })
    }

    const projeto = await prisma.projeto.create({
      data: {
        titulo,
        descricao,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        tipo,
        status,
        coordenadorId,
      },
      include: {
        coordenador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    })

    return reply.status(201).send(projeto)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: error.issues,
      })
    }
    throw error
  }
}

const getProjetosHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { tipo, status } = request.query as {
    tipo?: string
    status?: string
  }

  const projetos = await prisma.projeto.findMany({
    where: {
      tipo: tipo ? { equals: tipo as any } : undefined,
      status: status ? { equals: status as any } : undefined,
    },
    include: {
      coordenador: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
      participantes: {
        select: {
          id: true,
          aluno: {
            select: {
              id: true,
              nome: true,
              turma: true,
              curso: true,
            },
          },
          user: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          tipo: true,
          funcao: true,
          createdAt: true,
        },
      },
      imagens: {
        select: {
          id: true,
          url: true,
          principal: true,
        },
        orderBy: {
          principal: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reply.send(projetos)
}

const getProjetoHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string }

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    include: {
      coordenador: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
      participantes: {
        select: {
          id: true,
          aluno: {
            select: {
              id: true,
              nome: true,
              turma: true,
              curso: true,
            },
          },
          user: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          tipo: true,
          funcao: true,
          createdAt: true,
        },
      },
      imagens: {
        select: {
          id: true,
          url: true,
          principal: true,
          createdAt: true,
        },
        orderBy: {
          principal: 'desc',
        },
      },
    },
  })

  if (!projeto) {
    return reply.status(404).send({ error: 'Projeto não encontrado' })
  }

  return reply.send(projeto)
}

const updateProjetoHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { params, body } = updateProjetoSchema.parse({
      params: request.params,
      body: request.body,
    })

    const projeto = await prisma.projeto.findUnique({
      where: { id: params.id },
    })

    if (!projeto) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    if (body.coordenadorId && body.coordenadorId !== projeto.coordenadorId) {
      const coordenadorExists = await prisma.user.findUnique({
        where: { id: body.coordenadorId, role: 'COORDENADOR' },
      })
      if (!coordenadorExists) {
        return reply.status(400).send({ error: 'Coordenador não encontrado' })
      }
    }

    const updatedProjeto = await prisma.projeto.update({
      where: { id: params.id },
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        dataInicio: body.dataInicio ? new Date(body.dataInicio) : undefined,
        dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
        tipo: body.tipo,
        status: body.status,
        coordenadorId: body.coordenadorId,
      },
      include: {
        coordenador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    })

    return reply.send(updatedProjeto)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: error.issues,
      })
    }
    throw error
  }
}

const deleteProjetoHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = deleteProjetoSchema.parse(request.params)

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    include: {
      participantes: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!projeto) {
    return reply.status(404).send({ error: 'Projeto não encontrado' })
  }

  try {
    await prisma.projeto.delete({ where: { id } })
    return reply.status(204).send()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return reply.status(400).send({
          error:
            'Não é possível excluir o projeto pois existem dependências vinculadas',
        })
      }
    }
    throw error
  }
}

const vincularParticipanteHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { tipo, funcao, participanteId } = vincularParticipanteSchema.parse(
      request.body
    )
    const { projetoId } = request.params as { projetoId: string }

    const projetoExists = await prisma.projeto.findUnique({
      where: { id: projetoId },
    })

    if (!projetoExists) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    if (tipo === 'ALUNO') {
      const alunoExists = await prisma.aluno.findUnique({
        where: { id: participanteId },
      })
      if (!alunoExists) {
        return reply.status(404).send({ error: 'Aluno não encontrado' })
      }
    } else {
      const userExists = await prisma.user.findUnique({
        where: { id: participanteId },
      })
      if (!userExists) {
        return reply.status(404).send({ error: 'Servidor não encontrado' })
      }
    }

    const vinculoExists = await prisma.projetoParticipante.findFirst({
      where: {
        projetoId,
        OR: [
          { alunoId: tipo === 'ALUNO' ? participanteId : undefined },
          { userId: tipo === 'SERVIDOR' ? participanteId : undefined },
        ],
      },
    })

    if (vinculoExists) {
      return reply
        .status(400)
        .send({ error: 'Participante já vinculado a este projeto' })
    }

    const vinculo = await prisma.projetoParticipante.create({
      data: {
        projetoId,
        [tipo === 'ALUNO' ? 'alunoId' : 'userId']: participanteId,
        funcao,
        tipo: tipo as any,
      },
      include: {
        aluno:
          tipo === 'ALUNO'
            ? {
                select: {
                  id: true,
                  nome: true,
                  turma: true,
                },
              }
            : false,
        user:
          tipo === 'SERVIDOR'
            ? {
                select: {
                  id: true,
                  nome: true,
                  email: true,
                },
              }
            : false,
      },
    })

    return reply.status(201).send(vinculo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: error.issues,
      })
    }
    throw error
  }
}

const desvincularParticipanteHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { projetoId, participanteId } = request.params as {
    projetoId: string
    participanteId: string
  }

  const vinculo = await prisma.projetoParticipante.findFirst({
    where: {
      projetoId,
      OR: [{ alunoId: participanteId }, { userId: participanteId }],
    },
  })

  if (!vinculo) {
    return reply.status(404).send({ error: 'Vínculo não encontrado' })
  }

  await prisma.projetoParticipante.delete({
    where: { id: vinculo.id },
  })

  return reply.status(204).send()
}

const uploadImagemHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { projetoId } = request.params as { projetoId: string }
    const { principal = 'false' } = request.query as { principal?: string }
    const file = await request.file()

    if (!file) {
      return reply.status(400).send({ error: 'Nenhuma imagem enviada' })
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return reply.status(400).send({
        error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP',
      })
    }

    const projetoExists = await prisma.projeto.findUnique({
      where: { id: projetoId },
    })
    if (!projetoExists) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'images')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const sanitizedFilename = file.filename.replace(/[^a-zA-Z0-9._-]/g, '')
    const filename = `${Date.now()}-${sanitizedFilename}`
    const filePath = path.join(uploadDir, filename)

    try {
      await pipeline(file.file, createWriteStream(filePath))
    } catch (err) {
      console.error('Erro ao salvar arquivo:', err)
      return reply.status(500).send({
        error: 'Erro ao salvar arquivo no servidor',
        details: err instanceof Error ? err.message : undefined,
      })
    }

    const fileUrl = `/uploads/images/${filename}`
    const isPrincipal = principal === 'true'

    const result = await prisma.$transaction(async (prisma) => {
      if (isPrincipal) {
        await prisma.imagemProjeto.updateMany({
          where: { projetoId, principal: true },
          data: { principal: false },
        })
      }

      return await prisma.imagemProjeto.create({
        data: {
          url: fileUrl,
          projetoId,
          principal: isPrincipal,
        },
      })
    })

    return reply.status(201).send(result)
  } catch (error) {
    console.error('Erro no upload:', error)
    return reply.status(500).send({
      error: 'Erro interno no servidor ao processar upload',
      details: error instanceof Error ? error.message : undefined,
    })
  }
}

const removerImagemHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string }

  const imagem = await prisma.imagemProjeto.findUnique({
    where: { id },
  })

  if (!imagem) {
    return reply.status(404).send({ error: 'Imagem não encontrada' })
  }

  try {
    const filePath = path.join(
      __dirname,
      '..',
      'uploads',
      'images',
      path.basename(imagem.url)
    )
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Erro ao remover arquivo:', error)
  }

  await prisma.imagemProjeto.delete({
    where: { id },
  })

  return reply.status(204).send()
}

const definirImagemPrincipalHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string }

  const imagem = await prisma.imagemProjeto.findUnique({
    where: { id },
    include: { projeto: true },
  })

  if (!imagem) {
    return reply.status(404).send({ error: 'Imagem não encontrada' })
  }

  await prisma.imagemProjeto.updateMany({
    where: {
      projetoId: imagem.projetoId,
      principal: true,
      id: { not: id },
    },
    data: { principal: false },
  })

  const updated = await prisma.imagemProjeto.update({
    where: { id },
    data: { principal: true },
  })

  return reply.send(updated)
}

export {
  createProjetoHandler,
  getProjetosHandler,
  getProjetoHandler,
  updateProjetoHandler,
  deleteProjetoHandler,
  vincularParticipanteHandler,
  desvincularParticipanteHandler,
  uploadImagemHandler,
  removerImagemHandler,
  definirImagemPrincipalHandler,
}
