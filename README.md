# 🎓 Vitrine de Projetos | IFNMG

Vitrine de Projetos é uma plataforma institucional desenvolvida para centralizar, organizar e divulgar os projetos acadêmicos de Ensino, Pesquisa, Extensão e Trabalhos de Conclusão de Curso (TCCs) do Instituto Federal do Norte de Minas Gerais – Campus Almenara.

A aplicação é moderna, responsiva e multiusuário, com uma interface alinhada à identidade institucional e funcionalidades administrativas para coordenadores e gestores.

## 🏛️ Objetivo

Promover a visibilidade acadêmica, estimular a integração entre ensino e comunidade, facilitar a gestão interna de projetos e TCCs, e dar destaque ao protagonismo dos alunos e professores.

### Pilares principais:
- 📢 Divulgação pública com interface adaptável
- 🛠️ Gestão por coordenadores e administradores
- 🧠 Classificação por tipologia (Ensino, Pesquisa, Extensão, TCC)
- 🎓 Organização por curso, status e orientador
- 🛡️ Controle de acesso por perfil (admin, coordenador)

## ⚙️ Tecnologias Utilizadas

### 🎨 Frontend

| Tecnologia | Aplicação |
|------------|-----------|
| React + Vite | SPA rápida e moderna com modularização |
| TypeScript | Tipagem estática segura em todo o projeto |
| TailwindCSS | Estilização elegante, responsiva e institucional |
| ShadCN UI | Componentes acessíveis e personalizáveis |
| React Router v6 | Navegação fluida entre rotas protegidas |
| Axios | Consumo da API REST com interceptadores |
| React Hook Form + Zod | Formulários dinâmicos com validação robusta |
| Lucide Icons | Ícones leves e contextuais em toda a interface |

### 🔧 Backend

| Tecnologia | Aplicação |
|------------|-----------|
| Node.js + Fastify | Servidor HTTP escalável e performático |
| Prisma ORM | ORM moderno com suporte a MySQL e tipagem TypeScript |
| JWT | Autenticação com token para sessões seguras |
| Zod | Validação forte e tipada de schemas |
| bcryptjs | Criptografia de senhas com segurança |
| Multipart uploads | Suporte à imagem de projeto e arquivo PDF de TCC |

## 🔐 Autenticação e Segurança

- 👤 Login para coordenador e administrador via JWT (expira em 30 minutos)
- 🔒 Senhas criptografadas com bcryptjs
- 🧩 Middleware de acesso: authenticate e adminOnly
- 🚀 Usuário admin criado via prisma db seed
- 🛂 Proteção de rotas sensíveis por papel e token

## 📊 Funcionalidades

### 🌐 Área Pública
- Cards ilustrados com imagem, tipo e resumo
- Página de detalhes com dados completos e participantes
- Lista de TCCs com filtro por curso, orientador e aluno
- Navegação intuitiva, scroll suave e compatibilidade mobile

### 🔐 Área Administrativa
- Dashboard com navegação e indicadores institucionais
- CRUD completo para projetos, TCCs, usuários e alunos
- Filtros dinâmicos e visuais por tipo, status, curso e período
- Cadastro em lote de usuários e alunos via CSV
- Upload e remoção de imagens ilustrativas nos projetos
- Download de arquivo PDF dos TCCs direto do sistema
- Edição de senhas com validação client/server

### 🎓 Para Coordenadores
- Criação e edição de projetos e trabalhos
- Vinculação de alunos com função definida
- Visualização segmentada com estilo por curso e tipo de projeto

## 🧩 Estrutura de Código
- Rotas modulares: auth, projeto, TCC, usuário, aluno
- Controllers separados por domínio
- Middleware inteligente para autenticação e autorização
- Validação back e front-end com Zod
- Organização em serviços no frontend (API layer)

## 📋 Requisitos de Execução
- Node.js v18+
- MySQL ou MariaDB configurado com permissões
- Arquivo .env com a variável DATABASE_URL
- Backend rodando em http://localhost:8080
- Frontend rodando em http://localhost:5173

## 🚀 Instruções de Instalação

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📚 Principais Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /login | Autentica e retorna JWT |
| GET | /me | Retorna dados do usuário autenticado |
| POST | /users | Cria coordenador (admin only) |
| GET | /users | Lista todos os usuários (admin only) |
| POST | /projetos | Cria novo projeto |
| GET | /projetos | Lista projetos |
| GET | /projetos/url/:url | Consulta projeto por URL |
| POST | /projetos/:projetoId/alunos/:alunoId | Vincula aluno ao projeto |
| DELETE | /projetos/:projetoId/alunos/:alunoId | Remove aluno do projeto |
| POST | /projetos/:projetoId/imagem | Upload da imagem ilustrativa |
| DELETE | /projetos/imagem/:id | Remove imagem de projeto |
| POST | /tcc | Cria TCC com upload de PDF |
| GET | /tcc | Lista todos os TCCs |
| GET | /tcc/:id | Detalha TCC específico |
| GET | /tcc/:id/download | Download do documento PDF |

## 🧾 Autor e Instituição

**Desenvolvido por:** Gabriel Porto (Chinês)  
**Curso:** Análise e Desenvolvimento de Sistemas – IFNMG Campus Almenara  
**Disciplina:** Programação Web II  
**Período:** 2025 – Projeto Final

## 📘 Informações Institucionais

**Instituto Federal do Norte de Minas Gerais – Campus Almenara**  
📍 Rodovia BR 367, Zona Rural – Almenara/MG  
📬 CEP: 39900-000  
📧 comunicacao.almenara@ifnmg.edu.br  
📞 (038) 3218-7385
