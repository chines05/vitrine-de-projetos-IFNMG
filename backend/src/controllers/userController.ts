import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import {
  createUserSchema,
  updateUserSchema,
  updatePasswordSchema,
  deleteUserSchema,
} from '../validators/userValidator'
import { Especializacao } from '@prisma/client'

const createUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { nome, email, senha, role, especializacao } = createUserSchema.parse(
    request.body
  )

  const hashedPassword = await bcrypt.hash(senha, 10)

  const userExists = await prisma.user.findUnique({ where: { email } })
  if (userExists)
    return reply
      .status(400)
      .send({ error: 'Já existe um usuário com este e-mail' })

  const user = await prisma.user.create({
    data: {
      nome,
      email,
      senha: hashedPassword,
      role,
      especializacao: ['ADMIN', 'PROFESSOR'].includes(role)
        ? undefined
        : (especializacao as Especializacao),
    },
  })

  return reply.status(201).send({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  })
}

const importUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const file = await request.file()
  if (!file)
    return reply.status(400).send({ error: 'Arquivo CSV não encontrado.' })

  const buffer = await file.toBuffer()

  const registros = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<{
    nome: string
    'e-mail': string
    senha: string
    especializacao?: string
  }>

  const userSchema = z.object({
    nome: z.string().min(3),
    'e-mail': z.string().email(),
    senha: z.string().min(6),
  })

  const erros: any[] = []
  const inseridos: any[] = []

  for (const [index, registro] of registros.entries()) {
    const result = userSchema.safeParse(registro)
    if (!result.success) {
      erros.push({ linha: index + 1, mensagens: result.error.issues })
      continue
    }

    const { nome, 'e-mail': email, senha } = result.data

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      erros.push({
        linha: index + 1,
        mensagens: [{ message: 'E-mail já cadastrado.' }],
      })
      continue
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role: 'COORDENADOR',
        especializacao: Object.values(Especializacao).includes(
          registro.especializacao as Especializacao
        )
          ? (registro.especializacao as Especializacao)
          : undefined,
      },
    })

    inseridos.push(user)
  }

  return reply.send({
    totalRecebido: registros.length,
    totalInserido: inseridos.length,
    erros,
  })
}

const getUsersHandler = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      especializacao: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

const getCoordenadoresHandler = async () => {
  return prisma.user.findMany({
    where: { role: 'COORDENADOR' },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      especializacao: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

const updateUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { params, body } = updateUserSchema.parse({
    params: request.params,
    body: request.body,
  })

  const userExists = await prisma.user.findUnique({ where: { id: params.id } })
  if (!userExists)
    return reply.status(404).send({ error: 'Usuário não encontrado' })

  if (body.email && body.email !== userExists.email) {
    const emailInUse = await prisma.user.findUnique({
      where: { email: body.email },
    })
    if (emailInUse) return reply.status(400).send({ error: 'E-mail já em uso' })
  }

  const updateData: any = {
    nome: body.nome,
    email: body.email,
    role: body.role,
  }

  if (body.especializacao !== undefined)
    updateData.especializacao = body.especializacao

  if (body.senha) updateData.senha = await bcrypt.hash(body.senha, 10)

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: updateData,
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return updated
}

const updatePasswordHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { params, body } = updatePasswordSchema.parse({
    params: request.params,
    body: request.body,
  })

  const user = await prisma.user.findUnique({ where: { id: params.id } })
  if (!user) return reply.status(404).send({ error: 'Usuário não encontrado' })

  const isValid = await bcrypt.compare(body.senhaAtual, user.senha)
  if (!isValid)
    return reply.status(401).send({ error: 'Senha atual incorreta' })

  const isSame = await bcrypt.compare(body.novaSenha, user.senha)
  if (isSame)
    return reply.status(400).send({ error: 'Nova senha deve ser diferente' })

  const senhaCriptografada = await bcrypt.hash(body.novaSenha, 10)

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { senha: senhaCriptografada },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return reply.status(200).send(updated)
}

const deleteUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = deleteUserSchema.parse(request.params)
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) return reply.status(404).send({ error: 'Usuário não encontrado' })
  if (request.user.id === id)
    return reply.status(400).send({ error: 'Não pode se deletar' })

  try {
    await prisma.user.delete({ where: { id } })
    return reply.status(204).send({ id })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return reply.status(400).send({
        error: 'Usuário possui projetos vinculados e não pode ser excluído.',
      })
    }
    throw error
  }
}

export {
  createUserHandler,
  importUsersHandler,
  getUsersHandler,
  getCoordenadoresHandler,
  updateUserHandler,
  updatePasswordHandler,
  deleteUserHandler,
}
