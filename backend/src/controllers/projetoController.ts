import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'
import {
  createProjetoSchema,
  updateProjetoSchema,
  deleteProjetoSchema,
  vincularAlunoSchema,
} from '../validators/projetoValidator'
import fs from 'node:fs'
import path from 'node:path'
import pump from 'pump'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'

async function createProjetoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const {
      titulo,
      url,
      descricao,
      dataInicio,
      dataFim,
      tipo,
      status,
      coordenadorId,
    } = createProjetoSchema.parse(request.body)

    const urlExists = await prisma.projeto.findUnique({ where: { url } })
    if (urlExists) {
      return reply
        .status(400)
        .send({ error: 'Já existe um projeto com esta URL' })
    }

    const coordenadorExists = await prisma.user.findUnique({
      where: { id: coordenadorId, role: 'COORDENADOR' },
    })
    if (!coordenadorExists) {
      return reply.status(400).send({ error: 'Coordenador não encontrado' })
    }

    const projeto = await prisma.projeto.create({
      data: {
        titulo,
        url,
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

async function getProjetosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
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
          aluno: {
            select: {
              id: true,
              nome: true,
              turma: true,
            },
          },
          funcao: true,
        },
      },
      imagem: {
        select: {
          id: true,
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reply.send(projetos)
}

async function getProjetoHandler(request: FastifyRequest, reply: FastifyReply) {
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
          funcao: true,
          createdAt: true,
        },
      },
      imagem: {
        select: {
          id: true,
          url: true,
          createdAt: true,
        },
      },
    },
  })

  if (!projeto) {
    return reply.status(404).send({ error: 'Projeto não encontrado' })
  }

  return reply.send(projeto)
}

async function updateProjetoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
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

    if (body.url && body.url !== projeto.url) {
      const urlExists = await prisma.projeto.findUnique({
        where: { url: body.url },
      })
      if (urlExists) {
        return reply
          .status(400)
          .send({ error: 'Já existe um projeto com esta URL' })
      }
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
        url: body.url,
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

async function deleteProjetoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
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

async function vincularAlunoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { funcao } = vincularAlunoSchema.parse(request.body)

    const { projetoId, alunoId } = request.params as {
      projetoId: string
      alunoId: string
    }

    const projetoExists = await prisma.projeto.findUnique({
      where: { id: projetoId },
    })

    if (!projetoExists) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    const alunoExists = await prisma.aluno.findUnique({
      where: { id: alunoId },
    })
    if (!alunoExists) {
      return reply.status(404).send({ error: 'Aluno não encontrado' })
    }

    const vinculoExists = await prisma.projetoAluno.findFirst({
      where: {
        projetoId,
        alunoId,
      },
    })
    if (vinculoExists) {
      return reply
        .status(400)
        .send({ error: 'Aluno já vinculado a este projeto' })
    }

    const vinculo = await prisma.projetoAluno.create({
      data: {
        projetoId,
        alunoId,
        funcao,
      },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true,
            turma: true,
          },
        },
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

async function desvincularAlunoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { projetoId, alunoId } = request.params as {
    projetoId: string
    alunoId: string
  }

  const vinculo = await prisma.projetoAluno.findFirst({
    where: { projetoId, alunoId },
  })

  if (!vinculo) {
    return reply.status(404).send({ error: 'Vínculo não encontrado' })
  }

  await prisma.projetoAluno.delete({
    where: { id: vinculo.id },
  })

  return reply.status(204).send()
}

async function uploadImagemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { projetoId } = request.params as { projetoId: string }
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

    if (file.file.bytesRead > 5 * 1024 * 1024) {
      return reply.status(400).send({
        error: 'Arquivo muito grande. Tamanho máximo: 5MB',
      })
    }

    const projetoExists = await prisma.projeto.findUnique({
      where: { id: projetoId },
    })
    if (!projetoExists) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    const uploadDir = path.join(__dirname, '..', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const sanitizedFilename = file.filename.replace(/[^a-zA-Z0-9._-]/g, '')
    const filename = `${Date.now()}-${sanitizedFilename}`
    const filePath = path.join(uploadDir, filename)

    await pipeline(file.file, createWriteStream(filePath))

    const fileUrl = `/uploads/${filename}`

    await prisma.imagemProjeto.deleteMany({
      where: { projetoId },
    })

    const imagem = await prisma.imagemProjeto.create({
      data: {
        url: fileUrl,
        projetoId,
      },
      include: {
        projeto: true,
      },
    })

    return reply.status(201).send(imagem)
  } catch (error) {
    console.error('Erro detalhado:', error)
    return reply.status(500).send({
      error: 'Erro ao processar upload da imagem',
    })
  }
}

async function removerImagemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
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
      path.basename(imagem.url)
    )

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (fileError) {
    request.log.warn(`Não foi possível apagar arquivo físico: ${fileError}`)
  }

  await prisma.imagemProjeto.delete({
    where: { id },
  })

  return reply.status(204).send()
}

export {
  createProjetoHandler,
  getProjetosHandler,
  getProjetoHandler,
  updateProjetoHandler,
  deleteProjetoHandler,
  vincularAlunoHandler,
  desvincularAlunoHandler,
  uploadImagemHandler,
  removerImagemHandler,
}
