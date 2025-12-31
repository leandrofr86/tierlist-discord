import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TierItem } from './TierItem';

export function UnrankedPool({ items, tiers, onItemClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unranked'
  });

  // Pega apenas o próximo item a ser avaliado
  const nextItem = items.length > 0 ? items[0] : null;

  return (
    <div className="unranked-pool">
      <div className="unranked-header">
        <div className="unranked-title">
          Próximo item
        </div>
        <div className="unranked-counter">
          <span className="counter-current">{items.length}</span>
          <span className="counter-label">restantes</span>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`unranked-items ${isOver ? 'drag-over' : ''}`}
      >
        {!nextItem ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>Todos classificados!</h3>
            <p>Você terminou de classificar todos os itens.</p>
          </div>
        ) : (
          <div className="next-item-container">
            <TierItem 
              item={nextItem}
              tiers={tiers}
              onItemClick={onItemClick}
            />
            <div className="next-item-hint">
              Arraste para um tier ou clique para ampliar
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
