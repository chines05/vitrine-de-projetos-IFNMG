# 🎓 Vitrine de Projetos | IFNMG

**Vitrine de Projetos** é uma plataforma institucional desenvolvida para **centralizar, organizar e divulgar** os projetos acadêmicos de **Ensino**, **Pesquisa** e **Extensão** do Instituto Federal do Norte de Minas Gerais (IFNMG).

A aplicação é **moderna**, **responsiva** e **multiusuário**, preparada para diferentes perfis de acesso com funcionalidades administrativas completas e interface alinhada à identidade institucional.

---

## 🏛️ Objetivo

Promover a **visibilidade acadêmica** dos projetos desenvolvidos nos campi do IFNMG, reforçando o protagonismo dos projetos e facilitando a gestão interna.

### Principais pilares:

- 📢 Divulgação pública com interface adaptável
- 🛠️ Gestão administrativa por coordenadores e admins
- 🧠 Organização por tipologia (Ensino, Pesquisa, Extensão)
- 🛡️ Controle de acesso com perfis de usuário

---

## ⚙️ Tecnologias Utilizadas

### 🎨 Frontend

| Tecnologia               | Uso                                               |
|--------------------------|----------------------------------------------------|
| React + Vite             | SPA eficiente, modular e rápida                   |
| TypeScript               | Tipagem estática para segurança e produtividade   |
| TailwindCSS              | Estilização moderna e responsiva                  |
| ShadCN UI                | Componentes acessíveis e personalizáveis          |
| React Router v6          | Navegação entre rotas com fluidez                 |
| Axios                    | Comunicação com API REST                          |
| React Hook Form + Zod    | Validação client-side robusta                    |

### 🔧 Backend

| Tecnologia               | Uso                                               |
|--------------------------|----------------------------------------------------|
| Node.js + Fastify        | Servidor HTTP leve e escalável                    |
| Prisma ORM               | ORM com suporte a MySQL e tipagem TypeScript      |
| JWT                      | Autenticação baseada em tokens                    |
| Zod                      | Validação forte de dados                          |
| bcryptjs                 | Criptografia de senhas seguras                    |

---

## 🔐 Autenticação

O sistema possui login seguro com separação por papéis:

- 👤 Login de Coordenador e Admin via JWT (30 minutos de validade)
- 🔒 Senhas criptografadas com `bcryptjs`
- 🧩 Middleware de proteção `authenticate` e `adminOnly`
- 🚀 Admin padrão criado via `prisma db seed`

---

## 📊 Funcionalidades

### 🌐 Área Pública

- Cards ilustrados dos projetos
- Página de detalhes com coordenador, campus, curso e tipo
- Scroll suave e layout institucional adaptável

### 🔐 Área Administrativa

- Painel de controle com visão geral
- Gerenciamento de projetos, usuários e participantes
- Cadastro de alunos em lote via CSV
- Upload de imagens ilustrativas dos projetos
- Filtros por tipo, status, curso, coordenador e período
- Paginação automática e responsiva nas tabelas

### 🧠 Para Coordenadores

- Criação e edição de projetos
- Vinculação de participantes com função definida
- Dashboard com indicadores e acesso restrito

---

## 📋 Requisitos

- Node.js 18+
- MySQL ou MariaDB configurado
- `.env` com a variável `DATABASE_URL`
- Backend rodando em `http://localhost:8080`
- Frontend rodando em `http://localhost:5173`

---

## 🚀 Como Rodar Localmente

### 🔧 Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Principais Rotas da API

| Método | Rota                         | Descrição                                 |
|--------|------------------------------|-------------------------------------------|
| POST   | `/login`                     | Autentica e retorna JWT                   |
| GET    | `/me`                        | Retorna dados do usuário autenticado      |
| POST   | `/users`                     | Cria novo coordenador (admin only)        |
| GET    | `/users`                     | Lista todos os usuários (admin only)      |
| POST   | `/projetos`                  | Cria novo projeto                         |
| GET    | `/projetos`                  | Lista todos os projetos                   |
| POST   | `/projetos/:id/aluno/:id`    | Vincula aluno ao projeto                  |
| DELETE | `/projetos/:id/aluno/:id`    | Remove aluno do projeto                   |

---

## 🧾 Autor e Instituição

**Desenvolvido por:** Gabriel Porto (Chinês)  
**Curso:** Análise e Desenvolvimento de Sistemas – IFNMG Campus Almenara  
**Disciplina:** Programação Web II

---

## 📘 Referência Institucional

**Instituto Federal do Norte de Minas Gerais – Campus Almenara**  
Rodovia BR 367 Almenara/Jequitinhonha, km 111, Zona Rural, Almenara-MG  
📬 CEP: 39900-000  
📧 comunicacao.almenara@ifnmg.edu.br  
📞 (038) 3218-7385
