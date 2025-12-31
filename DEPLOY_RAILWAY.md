# 🚀 Deploy no Railway - Tierlist Discord

Este guia explica como colocar sua Tierlist Discord online usando o Railway.

---

## 📋 Pré-requisitos

1. Conta no GitHub (gratuita)
2. Conta no Railway (gratuita para começar)
3. Bot Discord já configurado (com token e channel ID)

---

## 📦 Passo 1: Subir o código para o GitHub

### 1.1 Criar repositório no GitHub

1. Acesse https://github.com e faça login
2. Clique em **"New"** (botão verde) para criar novo repositório
3. Nome: `tierlist-discord`
4. Deixe como **Public** ou **Private** (sua escolha)
5. **NÃO** marque "Add a README file"
6. Clique em **"Create repository"**

### 1.2 Subir os arquivos

**Opção A - Via GitHub Web (mais fácil):**

1. Na página do repositório criado, clique em **"uploading an existing file"**
2. Arraste a pasta `tierlist-discord` inteira
3. Clique em **"Commit changes"**

**Opção B - Via Git (linha de comando):**

```bash
cd tierlist-discord
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/tierlist-discord.git
git push -u origin main
```

---

## 🚂 Passo 2: Configurar o Railway

### 2.1 Criar conta no Railway

1. Acesse https://railway.app
2. Clique em **"Login"** → **"Login with GitHub"**
3. Autorize o Railway a acessar sua conta GitHub

### 2.2 Criar novo projeto

1. No dashboard do Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório `tierlist-discord`
4. Railway vai detectar o projeto automaticamente

---

## ⚙️ Passo 3: Configurar o Backend

### 3.1 Criar serviço do backend

1. No projeto Railway, clique em **"New"** → **"GitHub Repo"**
2. Selecione o mesmo repositório
3. Clique em **"Add Root Directory"** e digite: `backend`
4. Clique em **"Deploy"**

### 3.2 Configurar variáveis de ambiente

1. Clique no serviço do backend
2. Vá na aba **"Variables"**
3. Adicione as seguintes variáveis:

```
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CHANNEL_ID=id_do_canal_aqui
PORT=3001
```

4. Clique em **"Add"** para cada uma

### 3.3 Gerar domínio público

1. Na aba **"Settings"** do serviço backend
2. Em **"Networking"**, clique em **"Generate Domain"**
3. Copie a URL gerada (ex: `tierlist-backend-xxxx.up.railway.app`)

---

## 🎨 Passo 4: Configurar o Frontend

### 4.1 Criar serviço do frontend

1. No mesmo projeto, clique em **"New"** → **"GitHub Repo"**
2. Selecione o mesmo repositório novamente
3. Clique em **"Add Root Directory"** e digite: `frontend`
4. Clique em **"Deploy"**

### 4.2 Configurar variáveis de ambiente

1. Clique no serviço do frontend
2. Vá na aba **"Variables"**
3. Adicione:

```
VITE_BACKEND_URL=https://tierlist-backend-xxxx.up.railway.app
```

(Use a URL que você copiou no passo 3.3)

### 4.3 Gerar domínio público

1. Na aba **"Settings"** do serviço frontend
2. Em **"Networking"**, clique em **"Generate Domain"**
3. Esta será a URL pública da sua tierlist!

---

## 🔗 Passo 5: Conectar Backend e Frontend

### 5.1 Atualizar CORS no backend

1. Volte ao serviço do backend
2. Na aba **"Variables"**, adicione:

```
FRONTEND_URL=https://tierlist-frontend-xxxx.up.railway.app
```

(Use a URL do frontend que você gerou no passo 4.3)

3. O Railway vai fazer redeploy automaticamente

---

## ✅ Passo 6: Testar

1. Acesse a URL do frontend no navegador
2. Verifique se o status mostra **"Conectado"**
3. Teste postando algo no canal do Discord configurado

---

## 🔧 Troubleshooting

### "Desconectado" no frontend

1. Verifique se a URL do backend está correta em `VITE_BACKEND_URL`
2. Confira os logs do backend no Railway (clique no serviço → "Logs")
3. Verifique se `FRONTEND_URL` está configurado no backend

### Bot não conecta

1. Verifique se `DISCORD_TOKEN` está correto
2. Confira se as Intents estão ativadas no Discord Developer Portal
3. Veja os logs do backend para mensagens de erro

### Itens não aparecem

1. Verifique se `DISCORD_CHANNEL_ID` está correto
2. Confirme que o bot tem permissão no canal
3. Poste uma mensagem no canal e veja os logs

### Deploy falhou

1. Clique em **"View Logs"** para ver o erro
2. Geralmente é problema de dependências - verifique o `package.json`

---

## 💰 Custos do Railway

- **Plano gratuito**: $5 de crédito/mês (suficiente para testes)
- **Hobby Plan**: $5/mês + uso (recomendado para uso contínuo)
- O bot Discord precisa rodar 24/7, então o plano gratuito pode não ser suficiente para uso intenso

---

## 🎉 Pronto!

Sua Tierlist Discord agora está online e acessível de qualquer lugar!

**URL do app:** `https://tierlist-frontend-xxxx.up.railway.app`

Compartilhe com seus amigos do Discord!
