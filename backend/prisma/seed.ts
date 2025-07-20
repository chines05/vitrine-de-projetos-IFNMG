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
        nome: 'Prof. Carlos Silva',
        email: 'carlos.silva@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Ana Oliveira',
        email: 'ana.oliveira@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Marcos Santos',
        email: 'marcos.santos@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
      },
    }),
  ])

  const alunos = await Promise.all([
    prisma.aluno.create({
      data: {
        matricula: '20230001',
        nome: 'João Pereira',
        email: 'joao.pereira@ifnmg.edu.br',
        curso: 'Análise e Desenvolvimento de Sistemas',
        campus: 'Almenara',
      },
    }),
    prisma.aluno.create({
      data: {
        matricula: '20230002',
        nome: 'Maria Souza',
        email: 'maria.souza@ifnmg.edu.br',
        curso: 'Engenharia Agronômica',
        campus: 'Januária',
      },
    }),
    prisma.aluno.create({
      data: {
        matricula: '20230003',
        nome: 'Pedro Costa',
        email: 'pedro.costa@ifnmg.edu.br',
        curso: 'Licenciatura em Computação',
        campus: 'Montes Claros',
      },
    }),
    prisma.aluno.create({
      data: {
        matricula: '20230004',
        nome: 'Ana Santos',
        email: 'ana.santos@ifnmg.edu.br',
        curso: 'Agronomia',
        campus: 'Januária',
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
        resumo: 'Inovações para cultivo em regiões de seca prolongada.',
        dataInicio: new Date('2023-01-15'),
        tipo: 'PESQUISA',
        campus: 'Almenara',
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
        imagens: {
          create: [
            { url: '/uploads/agricultura-1.jpg' },
            { url: '/uploads/agricultura-2.jpg' },
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
        resumo: 'Tecnologias acessíveis para geração de energia limpa.',
        dataInicio: new Date('2023-03-10'),
        tipo: 'PESQUISA',
        campus: 'Januária',
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
        resumo:
          'Estratégias para engajar estudantes no processo de aprendizagem.',
        dataInicio: new Date('2023-02-20'),
        tipo: 'ENSINO',
        campus: 'Montes Claros',
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
        resumo: 'Redução do isolamento digital na terceira idade.',
        dataInicio: new Date('2023-04-05'),
        dataFim: new Date('2023-11-30'),
        tipo: 'EXTENSAO',
        status: 'CONCLUIDO',
        campus: 'Almenara',
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
        resumo: 'Agricultura urbana e segurança alimentar.',
        dataInicio: new Date('2023-05-15'),
        tipo: 'EXTENSAO',
        campus: 'Januária',
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
