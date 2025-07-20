# 🎓 Vitrine de Projetos | IFNMG

**Vitrine de Projetos** é uma plataforma institucional desenvolvida para centralizar, organizar e divulgar os projetos acadêmicos de **Ensino**, **Pesquisa** e **Extensão** do Instituto Federal do Norte de Minas Gerais (IFNMG). O sistema é moderno, responsivo e preparado para múltiplos perfis de acesso, com funcionalidades administrativas completas e interface institucional.

---

## 🏛️ Objetivo do Projeto

O propósito da aplicação é promover a **visibilidade acadêmica** dos projetos desenvolvidos nos campi do IFNMG, estruturando iniciativas por área de conhecimento, curso e tipo. Os principais pilares da plataforma são:

- 💡 Divulgação pública dos projetos
- 🛠 Gestão administrativa por coordenadores e administradores
- 🧩 Organização por tipologia (Ensino, Pesquisa, Extensão)
- 🔐 Controle de acesso baseado em perfis (Admin e Coordenador)

---

## 📦 Tecnologias Utilizadas

### 🎨 Frontend

| Tecnologia              | Finalidade                                       |
|-------------------------|--------------------------------------------------|
| React + Vite            | SPA rápida e modular                             |
| TypeScript              | Tipagem estática para segurança e produtividade |
| TailwindCSS             | Estilização moderna e responsiva                 |
| ShadCN UI               | Componentes acessíveis e personalizáveis        |
| React Router v6         | Navegação client-side com rotas dinâmicas       |
| Axios                   | Comunicação com a API backend                    |
| React Hook Form + Zod   | Validação de formulários em tempo real          |

### ⚙️ Backend

| Tecnologia              | Finalidade                                       |
|-------------------------|--------------------------------------------------|
| Node.js + Fastify       | Servidor HTTP leve e eficiente                   |
| Prisma ORM              | ORM para MySQL, com tipagem e migrações         |
| JWT                     | Autenticação baseada em tokens                   |
| Zod                     | Validação forte de entrada de dados             |
| bcryptjs                | Criptografia segura de senhas                    |

---

## 🔐 Autenticação

O sistema utiliza autenticação segura para coordenadores e administradores:

- 🔑 Login validado com Zod + React Hook Form
- 🔒 Verificação de credenciais via `bcrypt`
- 🔄 Geração de JWT válido por 7 dias
- 🛡️ Middleware `authenticate` e `adminOnly` para proteger rotas
- 🚀 Usuário admin criado automaticamente via `prisma db seed`

---

## 📊 Funcionalidades

### 👥 Área Pública

- Exibição dos projetos com cards ilustrados
- Página de detalhes (`/projeto/:id`) com coordenador, área e campus
- Scroll suave para vitrine de projetos
- Layout institucional responsivo

### 🔐 Área do Pesquisador

- Login com validação client-side
- Redirecionamento automático após autenticação
- Feedback com `react-hot-toast`

### 🧠 Dashboard Administrativo

- Sidebar fixa com menu por seção
- Componentes dinâmicos:
  - Visão Geral
  - Projetos
  - Participantes
  - Usuários
- Formulário de cadastro de coordenador (admin only)
- Menu lateral mobile com transições suaves

---

## 📈 Rotas da API (Backend)

| Método | Rota     | Descrição                              |
|--------|----------|----------------------------------------|
| POST   | `/login` | Autenticação e geração de token JWT    |
| GET    | `/me`    | Retorna dados do usuário autenticado   |
| POST   | `/users` | Criação de coordenadores (requer admin)|
| GET    | `/users` | Listagem de usuários (requer admin)    |

---

## 📋 Requisitos

- Node.js 18+
- MySQL ou MariaDB configurado
- `.env` com variável `DATABASE_URL`
- Backend rodando em `http://localhost:8080`
- Frontend rodando em `http://localhost:5173`

---

## 🚀 Como Executar o Projeto

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

## 🧾 Autor e Instituição

**Desenvolvido por** Gabriel Porto (Chinês)  
**Curso:** Análise e Desenvolvimento de Sistemas – IFNMG Campus Almenara  
**Disciplina:** Programação Web II

---

## 📘 Referência Institucional

**Instituto Federal do Norte de Minas Gerais – Campus Almenara**  
Rodovia BR 367 Almenara/Jequitinhonha, km 111, Zona Rural, Almenara-MG  
CEP: 39900-000  
📧 comunicacao.almenara@ifnmg.edu.br  
📞 (038) 3218-7385
