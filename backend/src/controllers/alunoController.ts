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
  try {
    const data = alunoSchema.parse(request.body)
    const aluno = await prisma.aluno.create({ data })
    return reply.status(201).send(aluno)
  } catch (error) {
    return reply.status(400).send({ error: 'Dados inválidos', details: error })
  }
}

export async function importAlunosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const file = await request.file()
    if (!file) {
      return reply.status(400).send({ error: 'Arquivo CSV não encontrado.' })
    }

    const buffer = await file.toBuffer()
    const registros = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<{ nome: string; turma: string; curso: string }>

    const erros: Array<{ linha: number; mensagens: string[] }> = []
    const validos: Array<{ nome: string; turma: string; curso: string }> = []

    for (const [index, registro] of registros.entries()) {
      const result = alunoSchema.safeParse(registro)
      if (result.success) {
        validos.push(result.data)
      } else {
        erros.push({
          linha: index + 1,
          mensagens: result.error.issues.map((issue) => issue.message),
        })
      }
    }

    if (validos.length > 0) {
      await prisma.aluno.createMany({
        data: validos,
        skipDuplicates: true, // Evita duplicatas
      })
    }

    return reply.send({
      totalRecebido: registros.length,
      totalInserido: validos.length,
      erros,
    })
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao processar arquivo' })
  }
}

export async function getAlunosHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const alunos = await prisma.aluno.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return reply.send(alunos)
  } catch (error) {
    return reply.status(500).send({ error: 'Erro ao buscar alunos' })
  }
}

export async function updateAlunoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { params, body } = updateAlunoSchema.parse({
      params: request.params,
      body: request.body,
    })

    const alunoExistente = await prisma.aluno.findUnique({
      where: { id: params.id },
    })

    if (!alunoExistente) {
      return reply.status(404).send({ error: 'Aluno não encontrado' })
    }

    // Verifica se a atualização não viola a constraint única
    if (body.nome || body.turma || body.curso) {
      const nome = body.nome || alunoExistente.nome
      const turma = body.turma || alunoExistente.turma
      const curso = body.curso || alunoExistente.curso

      const alunoComMesmaCombinacao = await prisma.aluno.findFirst({
        where: {
          nome,
          turma,
          curso,
          NOT: { id: params.id },
        },
      })

      if (alunoComMesmaCombinacao) {
        return reply.status(400).send({
          error:
            'Já existe um aluno com esta combinação de nome, turma e curso',
        })
      }
    }

    const alunoAtualizado = await prisma.aluno.update({
      where: { id: params.id },
      data: body,
    })

    return reply.send(alunoAtualizado)
  } catch (error) {
    return reply
      .status(400)
      .send({ error: 'Erro ao atualizar aluno', details: error })
  }
}

export async function deleteAlunoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = deleteAlunoSchema.parse(request.params)

    const aluno = await prisma.aluno.findUnique({ where: { id } })
    if (!aluno) {
      return reply.status(404).send({ error: 'Aluno não encontrado' })
    }

    await prisma.aluno.delete({ where: { id } })
    return reply.status(204).send()
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
    return reply.status(500).send({ error: 'Erro ao deletar aluno' })
  }
}
