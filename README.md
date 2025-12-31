# 🎮 Tierlist Discord Interativa

Uma tierlist onde você classifica itens de um canal do Discord e, após sua escolha, descobre a opinião da comunidade através de bordas coloridas.

![Preview](https://via.placeholder.com/800x400/0a0a0f/e8e8f0?text=Tierlist+Discord)

## ✨ Funcionalidades

- **Drag & Drop** - Arraste itens para os tiers S, A, B, C, D, E
- **Tempo Real** - Atualizações instantâneas via WebSocket
- **Reveal de Consenso** - A borda do item mostra a opinião da maioria só depois que você classifica
- **Customização** - Altere cores e nomes dos tiers
- **Discord Integration** - Lê mensagens e reações de um canal específico

## 📋 Pré-requisitos

- Node.js 18+
- Uma conta Discord com permissão para criar bots
- Um servidor Discord com um canal de texto para a tierlist

## 🤖 Configurando o Bot Discord

### 1. Criar o Bot

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **"New Application"**
3. Dê um nome (ex: "Tierlist Bot")
4. Na aba **"Bot"**, clique em **"Add Bot"**
5. Copie o **TOKEN** (você vai precisar dele depois)

### 2. Configurar Permissões

Na aba **"Bot"**, ative as seguintes **Privileged Gateway Intents**:

- ✅ **MESSAGE CONTENT INTENT** (obrigatório para ler mensagens)
- ✅ **SERVER MEMBERS INTENT** (opcional)

### 3. Gerar Link de Convite

1. Vá para a aba **"OAuth2" > "URL Generator"**
2. Em **Scopes**, selecione: `bot`
3. Em **Bot Permissions**, selecione:
   - `Read Messages/View Channels`
   - `Read Message History`
   - `Add Reactions` (opcional, para o bot reagir automaticamente)
4. Copie a URL gerada e abra no navegador para adicionar o bot ao seu servidor

### 4. Obter ID do Canal

1. No Discord, ative o **Modo Desenvolvedor** (Configurações > Avançado > Modo Desenvolvedor)
2. Clique com botão direito no canal desejado
3. Selecione **"Copiar ID"**

## 🚀 Instalação

### 1. Clone ou baixe o projeto

```bash
cd tierlist-discord
```

### 2. Configure o Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CHANNEL_ID=id_do_canal_aqui
PORT=3001
```

### 3. Configure o Frontend

```bash
cd ../frontend
npm install
```

## ▶️ Executando

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Você verá:
```
🚀 Servidor rodando na porta 3001
🤖 Bot conectado como TierlistBot#1234
📡 Carregando mensagens do canal: tierlist
✅ 15 itens carregados
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:3000**

## 📝 Como Usar

### No Discord

1. Poste mensagens ou imagens no canal configurado
2. Reaja às mensagens com os emojis de tier:
   - 🇸 para S
   - 🇦 para A
   - 🇧 para B
   - 🇨 para C
   - 🇩 para D
   - 🇪 para E

### No App

1. Os itens aparecerão na área "Itens para classificar"
2. Arraste cada item para o tier que você acha adequado
3. **Após soltar**, a borda do item revelará a opinião da comunidade:
   - A cor da borda = cor do tier com mais votos no Discord
   - Um badge mostrará a letra do tier de consenso
4. Passe o mouse sobre itens classificados para ver todos os votos

### Customização

- Clique no label de um tier (ex: S, A, B) para abrir o painel de configuração
- Altere o nome e a cor conforme desejar
- Clique em "Resetar" para começar do zero

## 🏗️ Arquitetura

```
tierlist-discord/
├── backend/
│   ├── server.js        # Express + WebSocket + Discord.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Componente principal
│   │   ├── components/
│   │   │   ├── TierRow.jsx      # Linha de tier
│   │   │   ├── TierItem.jsx     # Item arrastável
│   │   │   ├── UnrankedPool.jsx # Pool de não classificados
│   │   │   └── ConfigPanel.jsx  # Painel de config
│   │   ├── hooks/
│   │   │   └── useWebSocket.js  # Hook de conexão
│   │   └── styles/
│   │       └── global.css       # Estilos
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🎨 Emojis Customizados

Se quiser usar emojis diferentes, configure no `.env`:

```env
EMOJI_S=⭐
EMOJI_A=🔥
EMOJI_B=👍
EMOJI_C=😐
EMOJI_D=👎
EMOJI_E=💩
```

## 🔧 Troubleshooting

### "WebSocket desconectado"

- Verifique se o backend está rodando na porta 3001
- Confira se não há outro processo usando a mesma porta

### "Canal não encontrado"

- Confira se o ID do canal está correto
- Verifique se o bot está no servidor
- Confirme que o bot tem permissão para ler o canal

### "Nenhum item carregado"

- Poste algumas mensagens ou imagens no canal
- Verifique se o bot tem a intent `MESSAGE_CONTENT` ativada

### Reações não atualizam

- Confirme que está usando os emojis corretos (🇸🇦🇧🇨🇩🇪)
- As reações do próprio bot são ignoradas

## 📄 Licença

MIT - Use como quiser!
