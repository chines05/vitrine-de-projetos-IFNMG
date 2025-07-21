import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { authenticate, adminOnly } from '../middleware/auth'
import { parse } from 'csv-parse/sync'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

export async function alunoRoutes(app: FastifyInstance) {
  app.post(
    '/api/alunos',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const createAlunoSchema = z.object({
        nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
        turma: z.string().min(4, 'Turma deve ter no mínimo 4 caracteres'),
        curso: z.string().min(2, 'Curso é obrigatório'),
      })

      const { nome, turma, curso } = createAlunoSchema.parse(request.body)

      const aluno = await prisma.aluno.create({
        data: { nome, turma, curso },
      })

      return reply.status(201).send({
        id: aluno.id,
        nome: aluno.nome,
        turma: aluno.turma,
        curso: aluno.curso,
        createdAt: aluno.createdAt,
      })
    }
  )

  app.post(
    '/api/alunos/lote',
    {
      preHandler: [authenticate, adminOnly],
    },
    async (request, reply) => {
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

      const alunoSchema = z.object({
        nome: z.string().min(3),
        turma: z.string().min(4),
        curso: z.string().min(2),
      })

      const erros: any[] = []
      const inseridos: any[] = []

      for (const [index, registro] of registros.entries()) {
        const result = alunoSchema.safeParse(registro)

        if (!result.success) {
          erros.push({ linha: index + 1, mensagens: result.error.issues })
          continue
        }

        const { nome, turma, curso } = result.data

        const aluno = await prisma.aluno.create({
          data: { nome, turma, curso },
        })

        inseridos.push(aluno)
      }

      return reply.send({
        totalRecebido: registros.length,
        totalInserido: inseridos.length,
        erros,
      })
    }
  )

  app.get(
    '/api/alunos',
    { preHandler: [authenticate, adminOnly] },
    async () => {
      const alunos = await prisma.aluno.findMany({
        orderBy: { createdAt: 'desc' },
      })

      return alunos
    }
  )

  app.put(
    '/api/alunos/:id',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const updateAlunoSchema = z.object({
        params: z.object({
          id: z.string().uuid('ID inválido'),
        }),
        body: z.object({
          nome: z.string().min(3).optional(),
          turma: z.string().min(4).optional(),
          curso: z.string().min(2).optional(),
        }),
      })

      const {
        params: { id },
        body: data,
      } = updateAlunoSchema.parse(request)

      const alunoExists = await prisma.aluno.findUnique({ where: { id } })

      if (!alunoExists) {
        return reply.status(404).send({ error: 'Aluno não encontrado' })
      }

      const updatedAluno = await prisma.aluno.update({
        where: { id },
        data,
        select: {
          id: true,
          nome: true,
          turma: true,
          curso: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return updatedAluno
    }
  )

  app.delete(
    '/api/alunos/:id',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const { id } = z.object({ id: z.string().uuid() }).parse(request.params)

      const aluno = await prisma.aluno.findUnique({ where: { id } })

      if (!aluno) {
        return reply.status(404).send({ error: 'Aluno não encontrado' })
      }

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
  )
}
