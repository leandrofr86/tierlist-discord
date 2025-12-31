require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const http = require('http');

const app = express();

// CORS configurado para permitir o frontend (local e Railway)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Configuração dos emojis de tier
const TIER_EMOJIS = {
  S: process.env.EMOJI_S || '🇸',
  A: process.env.EMOJI_A || '🇦',
  B: process.env.EMOJI_B || '🇧',
  C: process.env.EMOJI_C || '🇨',
  D: process.env.EMOJI_D || '🇩',
  E: process.env.EMOJI_E || '🇪'
};

// Configuração padrão dos tiers
const DEFAULT_TIERS = [
  { id: 'S', label: 'S', color: '#ff7f7f' },
  { id: 'A', label: 'A', color: '#ffbf7f' },
  { id: 'B', label: 'B', color: '#ffdf7f' },
  { id: 'C', label: 'C', color: '#ffff7f' },
  { id: 'D', label: 'D', color: '#bfff7f' },
  { id: 'E', label: 'E', color: '#7fffff' }
];

// Armazenamento em memória dos itens
let tierItems = [];
let tierConfig = [...DEFAULT_TIERS];

// Cliente Discord
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Reaction]
});

// Função para extrair imagens de uma mensagem
function extractImages(message) {
  const images = [];
  
  // Anexos de imagem
  message.attachments.forEach(attachment => {
    if (attachment.contentType?.startsWith('image/')) {
      images.push(attachment.url);
    }
  });
  
  // Embeds com imagem
  message.embeds.forEach(embed => {
    if (embed.image) images.push(embed.image.url);
    if (embed.thumbnail) images.push(embed.thumbnail.url);
  });
  
  return images;
}

// Função para contar reações de tier
function countTierReactions(message) {
  const reactions = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };
  
  message.reactions.cache.forEach(reaction => {
    const emoji = reaction.emoji.name;
    for (const [tier, tierEmoji] of Object.entries(TIER_EMOJIS)) {
      if (emoji === tierEmoji || emoji === tier || emoji === tier.toLowerCase()) {
        reactions[tier] = reaction.count;
      }
    }
  });
  
  return reactions;
}

// Função para determinar o tier de consenso
function getConsensusTier(reactions) {
  const entries = Object.entries(reactions);
  const maxVotes = Math.max(...entries.map(([_, count]) => count));
  
  if (maxVotes === 0) return null;
  
  const winner = entries.find(([_, count]) => count === maxVotes);
  return winner ? winner[0] : null;
}

// Função para processar uma mensagem em item(s) de tierlist
function messageToItems(message) {
  const items = [];
  const reactions = countTierReactions(message);
  const consensusTier = getConsensusTier(reactions);
  const images = extractImages(message);
  
  // Se tem imagens, cada imagem é um item
  if (images.length > 0) {
    images.forEach((imageUrl, index) => {
      items.push({
        id: `${message.id}-img-${index}`,
        messageId: message.id,
        type: 'image',
        content: imageUrl,
        reactions,
        consensusTier,
        userTier: null,
        revealed: false
      });
    });
  }
  
  // Se tem texto (e não é só um link de imagem), adiciona como item de texto
  const textContent = message.content?.trim();
  if (textContent && !textContent.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)) {
    items.push({
      id: `${message.id}-text`,
      messageId: message.id,
      type: 'text',
      content: textContent,
      reactions,
      consensusTier,
      userTier: null,
      revealed: false
    });
  }
  
  return items;
}

// Função para carregar todas as mensagens do canal
async function loadChannelMessages() {
  const channelId = process.env.DISCORD_CHANNEL_ID;
  if (!channelId) {
    console.error('❌ DISCORD_CHANNEL_ID não configurado!');
    return;
  }
  
  try {
    const channel = await discord.channels.fetch(channelId);
    if (!channel) {
      console.error('❌ Canal não encontrado!');
      return;
    }
    
    console.log(`📡 Carregando mensagens do canal: ${channel.name}`);
    
    const messages = await channel.messages.fetch({ limit: 100 });
    tierItems = [];
    
    messages.forEach(message => {
      if (!message.author.bot) {
        const items = messageToItems(message);
        tierItems.push(...items);
      }
    });
    
    console.log(`✅ ${tierItems.length} itens carregados`);
    broadcastUpdate();
  } catch (error) {
    console.error('❌ Erro ao carregar mensagens:', error);
  }
}

// Função para atualizar um item específico
async function updateItemReactions(messageId) {
  const channelId = process.env.DISCORD_CHANNEL_ID;
  
  try {
    const channel = await discord.channels.fetch(channelId);
    const message = await channel.messages.fetch(messageId);
    const reactions = countTierReactions(message);
    const consensusTier = getConsensusTier(reactions);
    
    tierItems = tierItems.map(item => {
      if (item.messageId === messageId) {
        return { ...item, reactions, consensusTier };
      }
      return item;
    });
    
    broadcastUpdate();
  } catch (error) {
    console.error('Erro ao atualizar reações:', error);
  }
}

// WebSocket: broadcast para todos os clientes
function broadcastUpdate() {
  const data = JSON.stringify({
    type: 'update',
    items: tierItems,
    tiers: tierConfig
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

// WebSocket: conexão de cliente
wss.on('connection', (ws) => {
  console.log('🔌 Cliente conectado via WebSocket');
  
  // Envia estado atual
  ws.send(JSON.stringify({
    type: 'init',
    items: tierItems,
    tiers: tierConfig,
    emojis: TIER_EMOJIS
  }));
  
  ws.on('close', () => {
    console.log('🔌 Cliente desconectado');
  });
});

// Discord: eventos
discord.once('ready', () => {
  console.log(`🤖 Bot conectado como ${discord.user.tag}`);
  loadChannelMessages();
});

discord.on('messageCreate', async (message) => {
  if (message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
  if (message.author.bot) return;
  
  console.log('📨 Nova mensagem detectada');
  const items = messageToItems(message);
  tierItems.push(...items);
  broadcastUpdate();
});

discord.on('messageDelete', (message) => {
  if (message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
  
  tierItems = tierItems.filter(item => item.messageId !== message.id);
  broadcastUpdate();
});

discord.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
  if (user.bot) return;
  
  // Garante que a mensagem está completa
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Erro ao buscar reação:', error);
      return;
    }
  }
  
  updateItemReactions(reaction.message.id);
});

discord.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
  
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      return;
    }
  }
  
  updateItemReactions(reaction.message.id);
});

// API REST
app.get('/api/items', (req, res) => {
  res.json({ items: tierItems, tiers: tierConfig });
});

app.get('/api/tiers', (req, res) => {
  res.json(tierConfig);
});

app.post('/api/tiers', (req, res) => {
  const { tiers } = req.body;
  if (Array.isArray(tiers)) {
    tierConfig = tiers;
    broadcastUpdate();
    res.json({ success: true, tiers: tierConfig });
  } else {
    res.status(400).json({ error: 'Formato inválido' });
  }
});

app.post('/api/reload', async (req, res) => {
  await loadChannelMessages();
  res.json({ success: true, count: tierItems.length });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    discord: discord.isReady(),
    items: tierItems.length,
    clients: wss.clients.size
  });
});

// Inicialização
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
});

// Conecta ao Discord
if (process.env.DISCORD_TOKEN) {
  discord.login(process.env.DISCORD_TOKEN);
} else {
  console.error('❌ DISCORD_TOKEN não configurado!');
  console.log('📝 Copie .env.example para .env e configure suas credenciais');
}
