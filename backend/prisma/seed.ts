import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Chines05', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ifnmg.edu.br' },
    update: {},
    create: {
      nome: 'Admin IFNMG',
      email: 'admin@ifnmg.edu.br',
      senha: hashedPassword,
      role: 'ADMIN',
    },
  })

  const coordenadores = await Promise.all([
    prisma.user.create({
      data: {
        nome: 'Prof. Alan Oliveira',
        email: 'alan.oliveira@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Marcos Montanari',
        email: 'marcos.montanari@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Marcos Aurélio',
        email: 'marcos.aurelio@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
      },
    }),
  ])

  const alunos = await Promise.all([
    prisma.aluno.create({
      data: {
        nome: 'João Pereira',
        turma: 'TLAS124NA',
        curso: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
      },
    }),
    prisma.aluno.create({
      data: {
        nome: 'Maria Souza',
        turma: 'TENGA221JA',
        curso: 'Engenharia Agronômica',
      },
    }),
    prisma.aluno.create({
      data: {
        nome: 'Pedro Costa',
        turma: 'TLIC321MC',
        curso: 'Licenciatura em Computação',
      },
    }),
    prisma.aluno.create({
      data: {
        nome: 'Ana Santos',
        turma: 'TAGRO119JA',
        curso: 'Agronomia',
      },
    }),
  ])

  const projetosPesquisa = await Promise.all([
    prisma.projeto.create({
      data: {
        titulo: 'Agricultura Sustentável no Semiárido',
        url: 'agricultura-sustentavel',
        descricao:
          'Desenvolvimento de técnicas agrícolas adaptadas ao clima semiárido.',
        dataInicio: new Date('2023-01-15'),
        tipo: 'PESQUISA',
        coordenador: { connect: { id: coordenadores[0].id } },
        participantes: {
          create: [
            {
              alunoId: alunos[0].id,
              funcao: 'Pesquisador Principal',
            },
            {
              alunoId: alunos[1].id,
              funcao: 'Assistente de Campo',
            },
          ],
        },
      },
    }),

    prisma.projeto.create({
      data: {
        titulo: 'Energias Renováveis em Comunidades Rurais',
        url: 'energias-renovaveis',
        descricao:
          'Implementação de soluções energéticas sustentáveis em áreas remotas.',
        dataInicio: new Date('2023-03-10'),
        tipo: 'PESQUISA',
        coordenador: { connect: { id: coordenadores[1].id } },
        participantes: {
          create: [
            {
              alunoId: alunos[2].id,
              funcao: 'Coordenador de Campo',
            },
          ],
        },
      },
    }),
  ])

  const projetosEnsino = await Promise.all([
    prisma.projeto.create({
      data: {
        titulo: 'Metodologias Ativas de Aprendizagem',
        url: 'metodologias-ativas',
        descricao:
          'Implementação de novas abordagens pedagógicas no ensino técnico.',
        dataInicio: new Date('2023-02-20'),
        tipo: 'ENSINO',
        coordenador: { connect: { id: coordenadores[2].id } },
        participantes: {
          create: [{ alunoId: alunos[3].id, funcao: 'Monitor' }],
        },
      },
    }),
  ])

  const projetosExtensao = await Promise.all([
    prisma.projeto.create({
      data: {
        titulo: 'Educação Digital para Terceira Idade',
        url: 'educacao-digital',
        descricao: 'Oficinas de inclusão digital para idosos da comunidade.',
        dataInicio: new Date('2023-04-05'),
        dataFim: new Date('2023-11-30'),
        tipo: 'EXTENSAO',
        status: 'CONCLUIDO',
        coordenador: { connect: { id: coordenadores[0].id } },
        participantes: {
          create: [
            { alunoId: alunos[0].id, funcao: 'Instrutor' },
            { alunoId: alunos[2].id, funcao: 'Apoio Técnico' },
          ],
        },
      },
    }),
    prisma.projeto.create({
      data: {
        titulo: 'Horta Comunitária Sustentável',
        url: 'horta-comunitaria',
        descricao: 'Implementação de hortas urbanas em áreas públicas.',
        dataInicio: new Date('2023-05-15'),
        tipo: 'EXTENSAO',
        coordenador: { connect: { id: coordenadores[1].id } },
        participantes: {
          create: [
            { alunoId: alunos[1].id, funcao: 'Coordenador' },
            { alunoId: alunos[3].id, funcao: 'Voluntário' },
          ],
        },
      },
    }),
  ])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
