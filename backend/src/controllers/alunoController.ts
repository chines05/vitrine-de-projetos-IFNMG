import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'
import { parse } from 'csv-parse/sync'
import { Prisma } from '@prisma/client'
import {
  alunoSchema,
  updateAlunoSchema,
  deleteAlunoSchema,
} from '../validators/alunoValidator'

export async function createAlunoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = alunoSchema.parse(request.body)

  const aluno = await prisma.aluno.create({ data })

  return reply.status(201).send(aluno)
}

export async function importAlunosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const file = await request.file()
  if (!file)
    return reply.status(400).send({ error: 'Arquivo CSV não encontrado.' })

  const buffer = await file.toBuffer()

  const registros = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<{ nome: string; turma: string; curso: string }>

  const erros: any[] = []
  const validos: typeof registros = []

  registros.forEach((registro, index) => {
    const result = alunoSchema.safeParse(registro)
    if (result.success) {
      validos.push(result.data)
    } else {
      erros.push({ linha: index + 1, mensagens: result.error.issues })
    }
  })

  if (validos.length > 0) {
    await prisma.aluno.createMany({ data: validos })
  }

  return reply.send({
    totalRecebido: registros.length,
    totalInserido: validos.length,
    erros,
  })
}

export async function getAlunosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const alunos = await prisma.aluno.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return reply.send(alunos)
}

export async function updateAlunoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { params, body } = updateAlunoSchema.parse({
    params: request.params,
    body: request.body,
  })

  const aluno = await prisma.aluno.findUnique({ where: { id: params.id } })
  if (!aluno) return reply.status(404).send({ error: 'Aluno não encontrado' })

  const updated = await prisma.aluno.update({
    where: { id: params.id },
    data: body,
    select: {
      id: true,
      nome: true,
      turma: true,
      curso: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return reply.send(updated)
}

export async function deleteAlunoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = deleteAlunoSchema.parse(request.params)

  const aluno = await prisma.aluno.findUnique({ where: { id } })
  if (!aluno) return reply.status(404).send({ error: 'Aluno não encontrado' })

  try {
    await prisma.aluno.delete({ where: { id } })
    return reply.status(204).send({ id })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return reply.status(400).send({
        error:
          'Este aluno está vinculado a um ou mais projetos e não pode ser deletado.',
      })
    }
    throw error
  }
}
