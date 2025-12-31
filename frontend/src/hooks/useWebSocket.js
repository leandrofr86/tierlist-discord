import { useState, useEffect, useRef, useCallback } from 'react';

// Detecta automaticamente a URL do WebSocket
const getWsUrl = () => {
  // Em produção, usa a variável de ambiente
  if (import.meta.env.VITE_BACKEND_URL) {
    const url = import.meta.env.VITE_BACKEND_URL;
    return url.replace('https://', 'wss://').replace('http://', 'ws://');
  }
  
  // Em desenvolvimento local
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  return `${protocol}//${host}:3001`;
};

// Dados mock para teste quando não há conexão
const MOCK_ITEMS = [
  {
    id: 'mock-1',
    messageId: 'mock-1',
    type: 'text',
    content: 'Item de exemplo 1',
    reactions: { S: 5, A: 3, B: 2, C: 1, D: 0, E: 0 },
    consensusTier: 'S',
    userTier: null,
    revealed: false
  },
  {
    id: 'mock-2',
    messageId: 'mock-2',
    type: 'text',
    content: 'Item de exemplo 2',
    reactions: { S: 1, A: 8, B: 2, C: 0, D: 0, E: 0 },
    consensusTier: 'A',
    userTier: null,
    revealed: false
  },
  {
    id: 'mock-3',
    messageId: 'mock-3',
    type: 'text',
    content: 'Item de exemplo 3',
    reactions: { S: 0, A: 2, B: 6, C: 3, D: 1, E: 0 },
    consensusTier: 'B',
    userTier: null,
    revealed: false
  }
];

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [items, setItems] = useState(MOCK_ITEMS); // Começa com mock
  const [tiers, setTiers] = useState([]);
  const [emojis, setEmojis] = useState({});
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(getWsUrl());

      ws.onopen = () => {
        console.log('✅ WebSocket conectado');
        setConnected(true);
      };

      ws.onclose = () => {
        console.log('❌ WebSocket desconectado');
        setConnected(false);
        
        // Reconectar após 3 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Tentando reconectar...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket erro:', error);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'init' || data.type === 'update') {
            // Preserva o estado local dos itens (userTier, revealed)
            setItems(prevItems => {
              const itemMap = new Map(prevItems.map(item => [item.id, item]));
              
              return data.items.map(newItem => {
                const existing = itemMap.get(newItem.id);
                if (existing) {
                  return {
                    ...newItem,
                    userTier: existing.userTier,
                    revealed: existing.revealed
                  };
                }
                return newItem;
              });
            });
            
            if (data.tiers) {
              setTiers(data.tiers);
            }
            
            if (data.emojis) {
              setEmojis(data.emojis);
            }
          }
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const updateItemTier = useCallback((itemId, tierId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          userTier: tierId,
          revealed: tierId !== null // Só revela se foi classificado
        };
      }
      return item;
    }));
  }, []);

  const resetItem = useCallback((itemId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          userTier: null,
          revealed: false
        };
      }
      return item;
    }));
  }, []);

  const resetAll = useCallback(() => {
    setItems(prev => prev.map(item => ({
      ...item,
      userTier: null,
      revealed: false
    })));
  }, []);

  return {
    connected,
    items,
    tiers,
    emojis,
    setTiers,
    updateItemTier,
    resetItem,
    resetAll
  };
}
