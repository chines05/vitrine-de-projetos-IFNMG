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

async function createProjetoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const {
      titulo,
      url,
      descricao,
      resumo,
      dataInicio,
      dataFim,
      tipo,
      status,
      campus,
      coordenadorId,
    } = createProjetoSchema.parse(request.body)

    // Verificar se a URL já existe
    const urlExists = await prisma.projeto.findUnique({ where: { url } })
    if (urlExists) {
      return reply
        .status(400)
        .send({ error: 'Já existe um projeto com esta URL' })
    }

    // Verificar se o coordenador existe
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
        resumo,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        tipo,
        status,
        campus,
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
  const { campus, tipo, status } = request.query as {
    campus?: string
    tipo?: string
    status?: string
  }

  const projetos = await prisma.projeto.findMany({
    where: {
      campus: campus ? { equals: campus } : undefined,
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
      imagens: {
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
      imagens: {
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

    // Verificar se a nova URL já existe (caso tenha sido alterada)
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

    // Verificar se o novo coordenador existe (caso tenha sido alterado)
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
        resumo: body.resumo,
        dataInicio: body.dataInicio ? new Date(body.dataInicio) : undefined,
        dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
        tipo: body.tipo,
        status: body.status,
        campus: body.campus,
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
    const { projetoId, alunoId, funcao } = vincularAlunoSchema.parse(
      request.body
    )

    // Verificar se o projeto existe
    const projetoExists = await prisma.projeto.findUnique({
      where: { id: projetoId },
    })
    if (!projetoExists) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    // Verificar se o aluno existe
    const alunoExists = await prisma.aluno.findUnique({
      where: { id: alunoId },
    })
    if (!alunoExists) {
      return reply.status(404).send({ error: 'Aluno não encontrado' })
    }

    // Verificar se o aluno já está vinculado ao projeto
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

    // Criar o vínculo
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
  const { id } = request.params as { id: string }

  const vinculo = await prisma.projetoAluno.findUnique({
    where: { id },
  })

  if (!vinculo) {
    return reply.status(404).send({ error: 'Vínculo não encontrado' })
  }

  await prisma.projetoAluno.delete({
    where: { id },
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

    // Verificar se o projeto existe
    const projetoExists = await prisma.projeto.findUnique({
      where: { id: projetoId },
    })
    if (!projetoExists) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    // Aqui você implementaria a lógica para upload real (AWS S3, etc.)
    // Este é um exemplo simplificado que apenas simula o upload
    const fileUrl = `/uploads/${Date.now()}-${file.filename}`

    const imagem = await prisma.imagemProjeto.create({
      data: {
        url: fileUrl,
        projetoId,
      },
    })

    return reply.status(201).send(imagem)
  } catch (error) {
    throw error
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

  // Aqui você implementaria a lógica para remover o arquivo físico
  // Este é um exemplo simplificado que apenas remove do banco

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
