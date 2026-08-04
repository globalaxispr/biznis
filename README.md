# BizHaiti ERP 🇭🇹

Sistèm Pwofesyonèl pou Jesyon Komèsyal nan Ayiti.

![BizHaiti ERP](public/bizhaiti_login_bg.png)

## 📋 Deskripsyon

BizHaiti ERP é um sistema SaaS de gestão comercial de alto padrão, desenvolvido especificamente para pequenos e médios comércios do Haiti. A interface é 100% em Kreyòl Ayisyen, projetada com uma estética premium, responsiva (Mobile First) e otimizada para Tablets e Desktops. O sistema gerencia Vendas (PDV), Estoque, Clientes, Fornecedores, Relatórios Financeiros e Fluxo de Caixa.

## 🛠️ Tecnologias Utilizadas

- **Frontend Core:** React 19, TypeScript, Vite
- **Roteamento:** React Router (SPA com Lazy Loading)
- **Estilização & UI:** TailwindCSS v4, Framer Motion, shadcn/ui, Lucide React
- **Gerenciamento de Estado:** Zustand, TanStack Query (React Query)
- **Formulários & Validação:** React Hook Form, Zod
- **Backend as a Service:** Supabase (Auth, Postgres DB)

## ⚙️ Estrutura de Pastas

```bash
📦 src
 ┣ 📂 components  # Componentes reutilizáveis (Modais, UI, Inputs)
 ┣ 📂 hooks       # Custom React Hooks (React Query)
 ┣ 📂 layouts     # Estrutura base da página (Sidebar, Navbar, MainLayout)
 ┣ 📂 lib         # Configurações de bibliotecas (Supabase client)
 ┣ 📂 pages       # Páginas principais da aplicação (PDV, Dashboard, Login)
 ┣ 📂 repositories# Camada de abstração de dados (Clean Architecture)
 ┣ 📂 store       # Gerenciamento de estado global (Zustand)
 ┣ 📂 types       # Tipagens TypeScript (Interfaces e Types)
 ┗ 📂 utils       # Funções utilitárias (Formatação, utilitários Tailwind)
```

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (v18+)
- Conta no Supabase (Para criar o banco de dados)

### Passos de Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/bizhaiti-erp.git
cd bizhaiti-erp
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configuração de Variáveis de Ambiente:**
Renomeie o arquivo `.env.example` para `.env.local` e insira as chaves do seu projeto Supabase:
```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```
O sistema estará rodando em `http://localhost:5173`.

## 🗄️ Como Configurar o Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com/).
2. Vá em **Authentication** e habilite o provedor de E-mail.
3. No SQL Editor, crie as tabelas necessárias utilizando os schemas da aplicação (Vendas, Clientes, Produtos, etc).
4. No Dashboard, vá em **Project Settings > API** para copiar a `URL` e a `anon public key`.

## ☁️ Como Publicar na Vercel (Produção)

Este projeto está pronto para deploy (Production Ready) na Vercel. 

1. Faça o commit e envie seu projeto para um repositório no **GitHub**.
2. Acesse a [Vercel](https://vercel.com/) e clique em **Add New Project**.
3. Importe o repositório `bizhaiti-erp`.
4. Na sessão **Environment Variables**, adicione as seguintes chaves do seu Supabase:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique em **Deploy**.

*Nota: O arquivo `vercel.json` e a otimização de Code Splitting já estão configurados no projeto para garantir que o roteamento SPA funcione corretamente e a performance seja máxima.*

## 📜 Licença

Propriedade de BizHaiti. Todos os direitos reservados.
