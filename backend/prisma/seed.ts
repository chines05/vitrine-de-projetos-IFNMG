import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Chines05', 10)

  const uploadDir = path.join(__dirname, '..', 'uploads', 'images')
  const uploadFilesDir = path.join(__dirname, '..', 'uploads', 'files')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  if (!fs.existsSync(uploadFilesDir)) {
    fs.mkdirSync(uploadFilesDir, { recursive: true })
  }

  await prisma.imagemProjeto.deleteMany()
  await prisma.projetoAluno.deleteMany()
  await prisma.tCC.deleteMany()
  await prisma.projeto.deleteMany()
  await prisma.aluno.deleteMany()
  await prisma.user.deleteMany()

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
        curso: 'Tecnólogo em Processos Gerenciais',
      },
    }),
    prisma.aluno.create({
      data: {
        nome: 'Pedro Costa',
        turma: 'TLIC321MC',
        curso: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
      },
    }),
    prisma.aluno.create({
      data: {
        nome: 'Ana Santos',
        turma: 'TAGRO119JA',
        curso: 'Bacharelado em Engenharia Agronômica',
      },
    }),
    prisma.aluno.create({
      data: {
        nome: 'Lucas Oliveira',
        turma: 'TLAS124NA',
        curso: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
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
            { alunoId: alunos[0].id, funcao: 'Pesquisador Principal' },
            { alunoId: alunos[1].id, funcao: 'Assistente de Campo' },
          ],
        },
        imagens: {
          create: [
            {
              url: '/uploads/images/agricultura-1.jpg',
              principal: false,
            },
            {
              url: '/uploads/images/agricultura-2.jpg',
              principal: false,
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
          create: [{ alunoId: alunos[2].id, funcao: 'Coordenador de Campo' }],
        },
        imagens: {
          create: [
            {
              url: '/uploads/images/energia-1.jpg',
              principal: false,
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
        imagens: {
          create: [
            {
              url: '/uploads/images/ensino-1.jpg',
              principal: true,
            },
            {
              url: '/uploads/images/ensino-2.jpg',
              principal: false,
            },
            {
              url: '/uploads/images/ensino-3.jpg',
              principal: false,
            },
          ],
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
        imagens: {
          create: [
            {
              url: '/uploads/images/educacao-1.jpg',
              principal: false,
            },
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
        imagens: {
          create: [
            {
              url: '/uploads/images/horta-1.jpg',
              principal: false,
            },
            {
              url: '/uploads/images/horta-2.jpg',
              principal: false,
            },
          ],
        },
      },
    }),
  ])

  const tccs = await Promise.all([
    prisma.tCC.create({
      data: {
        titulo: 'Análise da Eficiência Energética em Redes Domésticas',
        curso: alunos[0].curso,
        resumo:
          'Estudo sobre o consumo energético de dispositivos IoT em redes domésticas.',
        dataDefesa: new Date('2024-12-10'),
        file: '/uploads/files/tcc-joao.pdf',
        aluno: { connect: { id: alunos[0].id } },
        coordenador: { connect: { id: coordenadores[0].id } },
        orientador: 'Prof. Dr. João Silva',
      },
    }),
    prisma.tCC.create({
      data: {
        titulo: 'Aplicações da Agricultura de Precisão em Culturas de Milho',
        curso: alunos[1].curso,
        resumo:
          'Avaliação do uso de sensores e mapas de produtividade para otimizar o cultivo de milho.',
        dataDefesa: new Date('2024-11-25'),
        file: '/uploads/files/tcc-maria.pdf',
        aluno: { connect: { id: alunos[1].id } },
        coordenador: { connect: { id: coordenadores[0].id } },
        orientador: 'Prof. Dra. Maria Santos',
      },
    }),
  ])

  console.log('Seed concluído com sucesso!')
  console.log({
    admin,
    coordenadores,
    alunos,
    projetos: [...projetosPesquisa, ...projetosEnsino, ...projetosExtensao],
    tccs,
  })
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
