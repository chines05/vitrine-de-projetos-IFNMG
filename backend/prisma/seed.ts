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
  await prisma.projetoParticipante.deleteMany()
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
      especializacao: undefined,
    },
  })

  const coordenadores = await Promise.all([
    prisma.user.create({
      data: {
        nome: 'Prof. Alan Oliveira',
        email: 'alan.oliveira@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
        especializacao: 'PESQUISA',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Marcos Montanari',
        email: 'marcos.montanari@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
        especializacao: 'EXTENSAO',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Marcos Aurélio',
        email: 'marcos.aurelio@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR',
        especializacao: 'ENSINO',
      },
    }),
  ])

  const coordenadoresCurso = await Promise.all([
    prisma.user.create({
      data: {
        nome: 'Prof. Carla Mendes',
        email: 'carla.mendes@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR_CURSO',
        especializacao: 'TECNOLOGO_EM_PROCESSOS_GERENCIAIS',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Paulo Ribeiro',
        email: 'paulo.ribeiro@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR_CURSO',
        especializacao: 'TECNOLOGIA_EM_ANALISE_E_DESENVOLVIMENTO_DE_SISTEMAS',
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Fernanda Lima',
        email: 'fernanda.lima@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'COORDENADOR_CURSO',
        especializacao: 'BACHARELADO_EM_ENGENHARIA_AGRONOMICA',
      },
    }),
  ])

  const professores = await Promise.all([
    prisma.user.create({
      data: {
        nome: 'Prof. João Silva',
        email: 'joao.silva@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'PROFESSOR',
        especializacao: undefined,
      },
    }),
    prisma.user.create({
      data: {
        nome: 'Prof. Maria Santos',
        email: 'maria.santos@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'PROFESSOR',
        especializacao: undefined,
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
              tipo: 'ALUNO',
            },
            {
              alunoId: alunos[1].id,
              funcao: 'Assistente de Campo',
              tipo: 'ALUNO',
            },
            {
              userId: professores[0].id,
              funcao: 'Orientador Científico',
              tipo: 'SERVIDOR',
            },
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
              tipo: 'ALUNO',
            },
            {
              userId: professores[1].id,
              funcao: 'Consultor Técnico',
              tipo: 'SERVIDOR',
            },
          ],
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
        descricao:
          'Implementação de novas abordagens pedagógicas no ensino técnico.',
        dataInicio: new Date('2023-02-20'),
        tipo: 'ENSINO',
        coordenador: { connect: { id: coordenadores[2].id } },
        participantes: {
          create: [
            {
              alunoId: alunos[3].id,
              funcao: 'Monitor',
              tipo: 'ALUNO',
            },
            {
              userId: coordenadoresCurso[0].id,
              funcao: 'Coordenador Pedagógico',
              tipo: 'SERVIDOR',
            },
          ],
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
        descricao: 'Oficinas de inclusão digital para idosos da comunidade.',
        dataInicio: new Date('2023-04-05'),
        dataFim: new Date('2023-11-30'),
        tipo: 'EXTENSAO',
        status: 'CONCLUIDO',
        coordenador: { connect: { id: coordenadores[0].id } },
        participantes: {
          create: [
            {
              alunoId: alunos[0].id,
              funcao: 'Instrutor',
              tipo: 'ALUNO',
            },
            {
              alunoId: alunos[2].id,
              funcao: 'Apoio Técnico',
              tipo: 'ALUNO',
            },
            {
              userId: professores[1].id,
              funcao: 'Supervisor',
              tipo: 'SERVIDOR',
            },
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
        descricao: 'Implementação de hortas urbanas em áreas públicas.',
        dataInicio: new Date('2023-05-15'),
        tipo: 'EXTENSAO',
        coordenador: { connect: { id: coordenadores[1].id } },
        participantes: {
          create: [
            {
              alunoId: alunos[1].id,
              funcao: 'Coordenador',
              tipo: 'ALUNO',
            },
            {
              alunoId: alunos[3].id,
              funcao: 'Voluntário',
              tipo: 'ALUNO',
            },
            {
              userId: coordenadoresCurso[2].id,
              funcao: 'Consultor Agronômico',
              tipo: 'SERVIDOR',
            },
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
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
