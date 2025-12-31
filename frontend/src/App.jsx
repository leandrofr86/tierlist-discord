import React, { useState, useMemo } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useWebSocket } from './hooks/useWebSocket';
import { TierRow } from './components/TierRow';
import { TierItem } from './components/TierItem';
import { UnrankedPool } from './components/UnrankedPool';
import { ConfigPanel } from './components/ConfigPanel';
import { ImageModal } from './components/ImageModal';

// Tiers padrão para fallback (agora com subtítulo)
const DEFAULT_TIERS = [
  { id: 'S', subtitle: '', color: '#ff7f7f' },
  { id: 'A', subtitle: '', color: '#ffbf7f' },
  { id: 'B', subtitle: '', color: '#ffdf7f' },
  { id: 'C', subtitle: '', color: '#ffff7f' },
  { id: 'D', subtitle: '', color: '#bfff7f' },
  { id: 'E', subtitle: '', color: '#7fffff' }
];

function App() {
  const { 
    connected, 
    items, 
    tiers: wsTiers, 
    setTiers,
    updateItemTier, 
    resetAll 
  } = useWebSocket();

  // Usa tiers do WebSocket ou fallback para default
  const tiers = wsTiers.length > 0 ? wsTiers : DEFAULT_TIERS;

  const [activeItem, setActiveItem] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [configTier, setConfigTier] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sensores para drag
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 }
    })
  );

  // Agrupa itens por tier
  const itemsByTier = useMemo(() => {
    const grouped = {
      unranked: []
    };
    
    tiers.forEach(tier => {
      grouped[tier.id] = [];
    });

    items.forEach(item => {
      if (item.userTier) {
        if (grouped[item.userTier]) {
          grouped[item.userTier].push(item);
        }
      } else {
        grouped.unranked.push(item);
      }
    });

    return grouped;
  }, [items, tiers]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = items.length;
    const classified = items.filter(i => i.userTier).length;
    const matches = items.filter(i => i.userTier && i.userTier === i.consensusTier).length;
    
    return { total, classified, matches };
  }, [items]);

  // Handlers de drag
  const handleDragStart = (event) => {
    const item = items.find(i => i.id === event.active.id);
    setActiveItem(item);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const itemId = active.id;
    const tierId = over.id;

    if (tierId === 'unranked') {
      // Voltou para pool de não classificados - reseta
      updateItemTier(itemId, null);
    } else {
      // Classificou em um tier
      updateItemTier(itemId, tierId);
    }
  };

  // Config handlers
  const handleConfigClick = (tier) => {
    setConfigTier(tier);
    setConfigOpen(true);
  };

  const handleConfigSave = (updatedTier) => {
    setTiers(prev => {
      const oldTier = prev.find(t => t.id === configTier.id);
      return prev.map(t => 
        t.id === oldTier.id ? updatedTier : t
      );
    });
  };

  // Modal handlers
  const handleItemClick = (item) => {
    setModalItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalItem(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <header className="app-header">
        <h1 className="app-title">TIERLIST</h1>
        <p className="app-subtitle">Classifique e compare com a comunidade</p>
        <div className="connection-status">
          <div className={`status-dot ${connected ? 'connected' : ''}`} />
          {connected ? 'Conectado' : 'Desconectado'}
        </div>
      </header>

      <main className="tierlist-container">
        {tiers.map(tier => (
          <TierRow
            key={tier.id}
            tier={tier}
            items={itemsByTier[tier.id] || []}
            tiers={tiers}
            onConfigClick={handleConfigClick}
            onItemClick={handleItemClick}
          />
        ))}
      </main>

      <UnrankedPool 
        items={itemsByTier.unranked || []} 
        tiers={tiers}
        onItemClick={handleItemClick}
      />

      {/* Estatísticas */}
      <div className="stats-bar">
        <div className="stat-item">
          <span>Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span>Classificados:</span>
          <span className="stat-value">{stats.classified}</span>
        </div>
        <div className="stat-item">
          <span>Concordam:</span>
          <span className="stat-value">{stats.matches}</span>
        </div>
        <button 
          className="config-btn secondary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
          onClick={resetAll}
        >
          Resetar
        </button>
      </div>

      {/* Overlay de drag */}
      <DragOverlay>
        {activeItem && (
          <TierItem item={activeItem} tiers={tiers} />
        )}
      </DragOverlay>

      {/* Painel de configuração */}
      <ConfigPanel
        isOpen={configOpen}
        tier={configTier}
        onClose={() => setConfigOpen(false)}
        onSave={handleConfigSave}
      />

      {/* Modal de visualização */}
      <ImageModal
        item={modalItem}
        isOpen={modalOpen}
        onClose={handleModalClose}
        tiers={tiers}
      />
    </DndContext>
  );
}

export default App;
