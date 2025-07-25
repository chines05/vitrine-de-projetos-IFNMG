import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import path from 'node:path'
import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { Prisma } from '@prisma/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createTCCHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = await request.file()

    if (!data || !data.fields) {
      return reply
        .status(400)
        .send({ error: 'Nenhum arquivo ou dados enviados' })
    }

    type FormFields = {
      [key: string]: { value: string } | undefined
      titulo?: { value: string }
      curso?: { value: string }
      resumo?: { value: string }
      dataDefesa?: { value: string }
      alunoId?: { value: string }
      coordenadorId?: { value: string }
      orientador?: { value: string }
    }

    const fields = data.fields as FormFields

    const requiredFields = [
      'titulo',
      'curso',
      'resumo',
      'dataDefesa',
      'alunoId',
      'coordenadorId',
      'orientador',
    ]

    for (const field of requiredFields) {
      if (!fields[field]?.value) {
        return reply.status(400).send({ error: `Campo ${field} é obrigatório` })
      }
    }

    const titulo = fields.titulo!.value
    const curso = fields.curso!.value
    const resumo = fields.resumo!.value
    const dataDefesa = fields.dataDefesa!.value
    const alunoId = fields.alunoId!.value
    const coordenadorId = fields.coordenadorId!.value
    const orientador = fields.orientador!.value

    let parsedDate: Date
    try {
      const [year, month, day] = dataDefesa.split('-').map(Number)
      parsedDate = new Date(year, month - 1, day)

      if (
        isNaN(parsedDate.getTime()) ||
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
      ) {
        throw new Error('Data inválida')
      }
    } catch (err) {
      console.error('Erro ao parsear data:', dataDefesa, err)
      return reply.status(400).send({
        error:
          'Formato de data inválido. Use exatamente o formato YYYY-MM-DD (ex: 2024-12-31)',
        received: dataDefesa,
      })
    }

    const [alunoExists, coordenadorExists] = await Promise.all([
      prisma.aluno.findUnique({ where: { id: alunoId } }),
      prisma.user.findUnique({ where: { id: coordenadorId } }),
    ])

    if (!alunoExists || !coordenadorExists) {
      return reply.status(400).send({
        error: 'Dados relacionados inválidos',
        details: {
          alunoExists: !!alunoExists,
          coordenadorExists: !!coordenadorExists,
        },
      })
    }

    if (!data.file) {
      return reply.status(400).send({ error: 'Arquivo do TCC não enviado' })
    }

    const allowedExtensions = ['.pdf']
    const fileExtension = path.extname(data.filename).toLowerCase()
    if (!allowedExtensions.includes(fileExtension)) {
      return reply
        .status(400)
        .send({ error: 'Apenas arquivos PDF são permitidos' })
    }

    const existingTCC = await prisma.tCC.findUnique({ where: { alunoId } })
    if (existingTCC) {
      return reply
        .status(400)
        .send({ error: 'Este aluno já possui um TCC cadastrado' })
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'files')
    try {
      await fs.mkdir(uploadDir, { recursive: true })
    } catch (err) {
      console.error('Erro ao criar diretório de upload:', err)
      return reply
        .status(500)
        .send({ error: 'Erro ao configurar sistema de arquivos' })
    }

    const fileName = `${randomUUID()}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    try {
      await fs.writeFile(filePath, await data.toBuffer())
    } catch (err) {
      console.error('Erro ao salvar arquivo:', err)
      return reply.status(500).send({ error: 'Erro ao salvar arquivo do TCC' })
    }

    const [aluno, coordenador] = await Promise.all([
      prisma.aluno.findUnique({ where: { id: alunoId } }),
      prisma.user.findUnique({
        where: {
          id: coordenadorId,
          role: { in: ['COORDENADOR', 'COORDENADOR_CURSO', 'ADMIN'] },
        },
      }),
    ])

    if (!aluno || !coordenador) {
      return reply.status(400).send({
        error: 'IDs inválidos',
        details: {
          alunoExists: !!aluno,
          coordenadorExists: !!coordenador,
          receivedIds: { alunoId, coordenadorId },
        },
      })
    }

    const newTCC = await prisma.tCC.create({
      data: {
        titulo,
        curso,
        resumo,
        dataDefesa: parsedDate,
        file: `files/${fileName}`,
        aluno: { connect: { id: alunoId } },
        coordenador: { connect: { id: coordenadorId } },
        orientador,
      },
      include: {
        aluno: true,
        coordenador: true,
      },
    })

    return reply.status(201).send(newTCC)
  } catch (error) {
    console.error('Erro detalhado ao criar TCC:', error)
    return reply.status(500).send({
      error: 'Erro interno ao processar TCC',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    })
  }
}

const downloadTCCHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string }

  try {
    const tcc = await prisma.tCC.findUnique({ where: { id } })
    if (!tcc) {
      return reply.status(404).send({ error: 'TCC não encontrado' })
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', tcc.file)

    try {
      await fs.access(filePath)
      reply.header('Content-Type', 'application/pdf')
      reply.header('Content-Disposition', `attachment; filename=${tcc.file}`)
      return reply.send(await fs.readFile(filePath))
    } catch {
      return reply.status(404).send({ error: 'Arquivo não encontrado' })
    }
  } catch (error) {
    console.error('Erro ao baixar TCC:', error)
    return reply.status(500).send({ error: 'Erro interno ao baixar arquivo' })
  }
}

const getAllTCCsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
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

const getTCCByIdHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
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

const updateTCCHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string }
    const {
      titulo,
      curso,
      resumo,
      dataDefesa,
      alunoId,
      coordenadorId,
      orientador,
    } = request.body as any

    const tccExistente = await prisma.tCC.findUnique({ where: { id } })
    if (!tccExistente) {
      return reply.status(404).send({ error: 'TCC não encontrado' })
    }

    if (alunoId || coordenadorId) {
      const [aluno, coordenador] = await Promise.all([
        alunoId
          ? prisma.aluno.findUnique({ where: { id: alunoId } })
          : Promise.resolve(tccExistente.alunoId),
        coordenadorId
          ? prisma.user.findUnique({
              where: {
                id: coordenadorId,
                role: { in: ['COORDENADOR', 'COORDENADOR_CURSO', 'ADMIN'] },
              },
            })
          : Promise.resolve(tccExistente.coordenadorId),
      ])

      if ((alunoId && !aluno) || (coordenadorId && !coordenador)) {
        return reply.status(400).send({
          error: 'IDs inválidos',
          details: {
            alunoExists: !!aluno,
            coordenadorExists: !!coordenador,
          },
        })
      }
    }

    const updated = await prisma.tCC.update({
      where: { id },
      data: {
        titulo,
        curso,
        resumo,
        dataDefesa: dataDefesa ? new Date(dataDefesa) : undefined,
        aluno: alunoId ? { connect: { id: alunoId } } : undefined,
        coordenador: coordenadorId
          ? { connect: { id: coordenadorId } }
          : undefined,
        orientador,
      },
      include: {
        aluno: true,
        coordenador: true,
      },
    })

    return reply.send(updated)
  } catch (error) {
    console.error('Erro ao atualizar TCC:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return reply
          .status(400)
          .send({ error: 'Aluno já possui TCC cadastrado' })
      }
    }
    return reply.status(500).send({ error: 'Erro ao atualizar TCC' })
  }
}

const deleteTCCHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string }

    const tcc = await prisma.tCC.findUnique({ where: { id } })
    if (!tcc) {
      return reply.status(404).send({ error: 'TCC não encontrado' })
    }

    const filePath = path.join(process.cwd(), 'uploads', tcc.file)
    try {
      await fs.unlink(filePath)
    } catch (err) {
      console.error('Aviso: Não foi possível deletar o arquivo físico', err)
    }

    await prisma.tCC.delete({ where: { id } })
    return reply.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar TCC:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return reply.status(400).send({
          error: 'Não é possível deletar - existem relacionamentos dependentes',
        })
      }
    }
    return reply.status(500).send({ error: 'Erro ao deletar TCC' })
  }
}

export {
  createTCCHandler,
  getTCCByIdHandler,
  getAllTCCsHandler,
  updateTCCHandler,
  deleteTCCHandler,
  downloadTCCHandler,
}
