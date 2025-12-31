# 📖 Manual Detalhado de Instalação - Tierlist Discord

Este manual explica passo a passo como instalar e testar o projeto da Tierlist Discord Interativa.

---

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Download do Projeto](#2-download-do-projeto)
3. [Instalação do Frontend](#3-instalação-do-frontend)
4. [Testando o Frontend (sem Discord)](#4-testando-o-frontend-sem-discord)
5. [Configuração do Bot Discord](#5-configuração-do-bot-discord)
6. [Instalação do Backend](#6-instalação-do-backend)
7. [Executando o Sistema Completo](#7-executando-o-sistema-completo)
8. [Resolução de Problemas](#8-resolução-de-problemas)

---

## 1. Pré-requisitos

### Node.js (Obrigatório)

O projeto requer **Node.js versão 18 ou superior**.

#### Verificando se já está instalado:

Abra o terminal (Prompt de Comando no Windows, Terminal no Mac/Linux) e digite:

```bash
node --version
```

Se aparecer algo como `v18.x.x` ou `v20.x.x`, você já tem o Node.js instalado.

#### Instalando o Node.js:

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (Long Term Support)
3. Execute o instalador e siga as instruções
4. **Importante no Windows**: Marque a opção "Add to PATH" durante a instalação
5. Após instalar, **feche e abra novamente o terminal**
6. Verifique a instalação com `node --version`

#### Verificando o npm:

O npm (Node Package Manager) vem junto com o Node.js. Verifique:

```bash
npm --version
```

Deve aparecer algo como `9.x.x` ou `10.x.x`.

---

## 2. Download do Projeto

### Passo 2.1: Baixar o arquivo ZIP

Baixe o arquivo `tierlist-discord.zip` que foi gerado.

### Passo 2.2: Extrair o arquivo

1. Localize o arquivo `tierlist-discord.zip` na pasta de Downloads
2. Clique com botão direito → **"Extrair tudo"** (Windows) ou dê duplo clique (Mac)
3. Escolha onde extrair (ex: Desktop ou uma pasta de projetos)

### Passo 2.3: Verificar a estrutura

Após extrair, você deve ter esta estrutura de pastas:

```
tierlist-discord/
│
├── backend/
│   ├── .env.example      ← Modelo de configuração
│   ├── package.json      ← Dependências do backend
│   └── server.js         ← Servidor Node.js + Bot Discord
│
├── frontend/
│   ├── index.html        ← HTML principal
│   ├── package.json      ← Dependências do frontend
│   ├── vite.config.js    ← Configuração do Vite
│   └── src/
│       ├── main.jsx      ← Entry point React
│       ├── App.jsx       ← Componente principal
│       ├── components/
│       │   ├── ConfigPanel.jsx
│       │   ├── TierItem.jsx
│       │   ├── TierRow.jsx
│       │   └── UnrankedPool.jsx
│       ├── hooks/
│       │   └── useWebSocket.js
│       └── styles/
│           └── global.css
│
├── README.md             ← Documentação geral
└── MANUAL_INSTALACAO.md  ← Este manual
```

**⚠️ Se alguma pasta ou arquivo estiver faltando:**
- Verifique se extraiu completamente o ZIP
- Tente extrair novamente em outra pasta

### Passo 2.4: Abrir o terminal na pasta do projeto

**Windows:**
1. Abra a pasta `tierlist-discord` no Explorador de Arquivos
2. Clique na barra de endereço (onde mostra o caminho)
3. Digite `cmd` e pressione Enter
4. O Prompt de Comando abrirá já na pasta correta

**Mac:**
1. Abra a pasta `tierlist-discord` no Finder
2. Clique com botão direito na pasta
3. Selecione "Novo Terminal na Pasta"

**Linux:**
1. Abra a pasta no gerenciador de arquivos
2. Clique com botão direito → "Abrir Terminal aqui"

**Ou navegue manualmente:**
```bash
# Windows (exemplo)
cd C:\Users\SeuNome\Desktop\tierlist-discord

# Mac/Linux (exemplo)
cd ~/Desktop/tierlist-discord
```

---

## 3. Instalação do Frontend

O frontend é a interface visual onde você arrasta os itens. Vamos instalá-lo primeiro.

### Passo 3.1: Entrar na pasta do frontend

```bash
cd frontend
```

### Passo 3.2: Instalar as dependências

```bash
npm install
```

**O que acontece aqui:**
- O npm lê o arquivo `package.json`
- Baixa todas as bibliotecas necessárias (React, dnd-kit, etc.)
- Cria uma pasta `node_modules` com os arquivos

**Tempo estimado**: 30 segundos a 2 minutos (depende da sua internet)

**Saída esperada** (exemplo):
```
added 215 packages in 45s
```

### Passo 3.3: Verificar se instalou corretamente

A pasta `frontend` agora deve conter:

```
frontend/
├── node_modules/     ← Nova pasta criada!
├── package.json
├── package-lock.json ← Novo arquivo criado!
├── vite.config.js
├── index.html
└── src/
```

---

## 4. Testando o Frontend (sem Discord)

Antes de configurar o Discord, vamos testar se a interface funciona.

### Passo 4.1: Iniciar o servidor de desenvolvimento

Ainda dentro da pasta `frontend`, execute:

```bash
npm run dev
```

**Saída esperada**:
```
  VITE v5.0.12  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

### Passo 4.2: Abrir no navegador

1. Abra seu navegador (Chrome, Firefox, Edge, etc.)
2. Acesse: **http://localhost:3000**

### Passo 4.3: O que você deve ver

✅ **Tela correta:**
- Fundo escuro (quase preto)
- Título grande "TIERLIST" com gradiente
- 6 linhas coloridas (S vermelho, A laranja, B amarelo, etc.)
- Área "Itens para classificar" com 3 itens de exemplo
- Status "Desconectado" no canto superior direito

❌ **Se a tela estiver branca:**
- Pressione F12 para abrir as Ferramentas de Desenvolvedor
- Vá na aba "Console"
- Veja se há erros em vermelho
- Me envie a mensagem de erro

### Passo 4.4: Testando o drag and drop

1. Clique e segure em um dos itens de exemplo
2. Arraste para uma das linhas de tier (S, A, B, etc.)
3. Solte o item
4. O item deve aparecer na linha e mostrar uma borda colorida

### Passo 4.5: Parar o servidor

Para parar o servidor de desenvolvimento, volte ao terminal e pressione:

```
Ctrl + C
```

---

## 5. Configuração do Bot Discord

Esta etapa é necessária apenas se você quiser conectar ao Discord.

### Passo 5.1: Criar uma aplicação no Discord

1. Acesse: https://discord.com/developers/applications
2. Faça login com sua conta Discord
3. Clique no botão **"New Application"** (canto superior direito)
4. Digite um nome (ex: "Tierlist Bot")
5. Aceite os termos e clique **"Create"**

### Passo 5.2: Criar o Bot

1. No menu lateral, clique em **"Bot"**
2. Clique em **"Add Bot"**
3. Confirme clicando em **"Yes, do it!"**

### Passo 5.3: Copiar o Token

1. Na seção "TOKEN", clique em **"Reset Token"**
2. Confirme a ação
3. Clique em **"Copy"** para copiar o token
4. **GUARDE ESTE TOKEN** - você vai precisar dele depois
5. ⚠️ **NUNCA compartilhe este token publicamente!**

### Passo 5.4: Configurar as Intents

Ainda na página do Bot, role para baixo até **"Privileged Gateway Intents"**:

1. Ative **MESSAGE CONTENT INTENT** ✅
2. Ative **SERVER MEMBERS INTENT** ✅ (opcional)
3. Clique em **"Save Changes"**

### Passo 5.5: Gerar link de convite

1. No menu lateral, clique em **"OAuth2"** → **"URL Generator"**
2. Em **SCOPES**, marque: `bot`
3. Em **BOT PERMISSIONS**, marque:
   - `Read Messages/View Channels`
   - `Read Message History`
   - `Add Reactions` (opcional)
4. Copie a URL gerada no final da página
5. Abra essa URL no navegador
6. Selecione o servidor onde quer adicionar o bot
7. Clique em **"Autorizar"**

### Passo 5.6: Obter o ID do canal

1. No Discord (aplicativo ou web), vá em **Configurações de Usuário**
2. Em **Configurações do App**, clique em **"Avançado"**
3. Ative **"Modo Desenvolvedor"**
4. Volte para o servidor
5. Clique com botão direito no canal desejado
6. Clique em **"Copiar ID"**
7. **GUARDE ESTE ID** - você vai precisar dele depois

---

## 6. Instalação do Backend

### Passo 6.1: Abrir novo terminal

Deixe o terminal do frontend aberto (ou abra um novo).

### Passo 6.2: Navegar até a pasta do backend

```bash
# Se você está na pasta tierlist-discord
cd backend

# Ou se está na pasta frontend
cd ../backend
```

### Passo 6.3: Instalar dependências

```bash
npm install
```

**Saída esperada**:
```
added 125 packages in 30s
```

### Passo 6.4: Criar arquivo de configuração

Copie o arquivo de exemplo:

```bash
# Windows (Prompt de Comando)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

### Passo 6.5: Editar o arquivo .env

Abra o arquivo `.env` com um editor de texto:

```bash
# Windows (Notepad)
notepad .env

# Mac
open -e .env

# Linux
nano .env
```

Edite o conteúdo:

```env
# Cole aqui o token que você copiou no Passo 5.3
DISCORD_TOKEN=seu_token_aqui

# Cole aqui o ID do canal que você copiou no Passo 5.6
DISCORD_CHANNEL_ID=id_do_canal_aqui

# Porta do servidor (pode deixar assim)
PORT=3001
```

**Exemplo preenchido** (NÃO use estes valores):
```env
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.ABcDeF.abcdefghijklmnopqrstuvwxyz123456
DISCORD_CHANNEL_ID=1234567890123456789
PORT=3001
```

Salve e feche o arquivo.

---

## 7. Executando o Sistema Completo

Você precisará de **dois terminais** abertos simultaneamente.

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

**Saída esperada**:
```
🚀 Servidor rodando na porta 3001
   API: http://localhost:3001/api
   WebSocket: ws://localhost:3001
🤖 Bot conectado como TierlistBot#1234
📡 Carregando mensagens do canal: nome-do-canal
✅ 5 itens carregados
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

**Saída esperada**:
```
  VITE v5.0.12  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

### Verificando a conexão

1. Abra http://localhost:3000 no navegador
2. O status no canto superior direito deve mudar para **"Conectado"** (com bolinha verde)
3. Os itens do canal Discord devem aparecer na área "Itens para classificar"

### Testando as reações

1. No Discord, poste uma mensagem ou imagem no canal configurado
2. Reaja à mensagem com 🇸, 🇦, 🇧, 🇨, 🇩 ou 🇪
3. No app, arraste o item para um tier
4. A borda deve mostrar a cor do tier mais votado no Discord

---

## 8. Resolução de Problemas

### ❌ "npm: comando não encontrado" ou "'npm' não é reconhecido"

**Causa**: Node.js não está instalado ou não está no PATH.

**Solução**:
1. Reinstale o Node.js do site oficial
2. No Windows, marque "Add to PATH"
3. Feche e abra novamente o terminal

---

### ❌ Tela branca no navegador

**Causa**: Erro de JavaScript.

**Solução**:
1. Abra o console do navegador (F12 → Console)
2. Veja a mensagem de erro em vermelho
3. Comum: "Module not found" → Execute `npm install` novamente

---

### ❌ "DISCORD_TOKEN não configurado!"

**Causa**: Arquivo .env não existe ou está vazio.

**Solução**:
1. Verifique se o arquivo `.env` existe na pasta `backend`
2. Verifique se você salvou após editar
3. O arquivo deve ter extensão `.env` (não `.env.txt`)

---

### ❌ "Canal não encontrado!"

**Causa**: ID do canal incorreto ou bot não tem acesso.

**Solução**:
1. Verifique se o ID do canal está correto
2. Verifique se o bot foi adicionado ao servidor
3. Verifique se o bot tem permissão para ver o canal

---

### ❌ "Used disallowed intents"

**Causa**: Intents não ativadas no painel do Discord.

**Solução**:
1. Volte ao Discord Developer Portal
2. Vá em Bot → Privileged Gateway Intents
3. Ative MESSAGE CONTENT INTENT
4. Salve e reinicie o backend

---

### ❌ Status sempre "Desconectado"

**Causa**: Backend não está rodando.

**Solução**:
1. Verifique se o terminal do backend mostra "🚀 Servidor rodando"
2. Verifique se a porta 3001 está livre
3. Tente mudar a porta no .env para 3002

---

### ❌ Itens não aparecem

**Causa**: Canal vazio ou sem reações.

**Solução**:
1. Poste algumas mensagens ou imagens no canal do Discord
2. Adicione reações com os emojis de letra (🇸, 🇦, etc.)
3. Clique em "Resetar" no app para recarregar

---

### ❌ Erro "EADDRINUSE: address already in use"

**Causa**: A porta já está sendo usada por outro processo.

**Solução**:
```bash
# Windows - encontrar e matar processo na porta 3001
netstat -ano | findstr :3001
taskkill /PID <numero_do_pid> /F

# Mac/Linux
lsof -i :3001
kill -9 <numero_do_pid>
```

Ou mude a porta no arquivo `.env`.

---

## 🎉 Pronto!

Se tudo funcionou, você agora tem:
- Uma interface visual para criar tierlists
- Conexão em tempo real com um canal do Discord
- Sistema de revelação de consenso da comunidade

**Dúvidas?** Verifique o arquivo README.md ou me pergunte!
