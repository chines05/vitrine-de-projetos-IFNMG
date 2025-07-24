import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

export async function createTCCHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    titulo,
    url,
    curso,
    resumo,
    dataDefesa,
    arquivoUrl,
    alunoId,
    coordenadorId,
  } = request.body as any

  try {
    const existingTCC = await prisma.tCC.findUnique({ where: { alunoId } })
    if (existingTCC) {
      return reply.status(400).send({ error: 'Este aluno já possui um TCC.' })
    }

    const newTCC = await prisma.tCC.create({
      data: {
        titulo,
        url,
        curso,
        resumo,
        dataDefesa: new Date(dataDefesa),
        arquivoUrl,
        alunoId,
        coordenadorId,
      },
    })

    return reply.status(201).send(newTCC)
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao criar TCC.' })
  }
}

export async function getAllTCCsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const tccs = await prisma.tCC.findMany({
      include: {
        aluno: true,
        coordenador: true,
      },
    })
    return reply.send(tccs)
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar TCCs.' })
  }
}

export async function getTCCByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string }

  try {
    const tcc = await prisma.tCC.findUnique({
      where: { id },
      include: {
        aluno: true,
        coordenador: true,
      },
    })

    if (!tcc) {
      return reply.status(404).send({ error: 'TCC não encontrado.' })
    }

    return reply.send(tcc)
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar TCC.' })
  }
}

export async function updateTCCHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string }
  const data = request.body as any

  try {
    const updated = await prisma.tCC.update({
      where: { id },
      data: {
        ...data,
        dataDefesa: data.dataDefesa ? new Date(data.dataDefesa) : undefined,
      },
    })

    return reply.send(updated)
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao atualizar TCC.' })
  }
}

export async function deleteTCCHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string }

  try {
    await prisma.tCC.delete({ where: { id } })
    return reply.status(204).send()
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao deletar TCC.' })
  }
}
