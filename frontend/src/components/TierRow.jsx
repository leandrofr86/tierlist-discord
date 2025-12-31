import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TierItem } from './TierItem';

export function TierRow({ tier, items, tiers, onConfigClick, onItemClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: tier.id
  });

  return (
    <div className="tier-row">
      <div 
        className="tier-label"
        style={{ backgroundColor: tier.color }}
        onClick={() => onConfigClick(tier)}
        title="Clique para configurar"
      >
        <span className="tier-letter">{tier.id}</span>
        {tier.subtitle && (
          <span className="tier-subtitle">{tier.subtitle}</span>
        )}
      </div>
      <div 
        ref={setNodeRef}
        className={`tier-content ${isOver ? 'drag-over' : ''}`}
      >
        {items.map(item => (
          <TierItem 
            key={item.id} 
            item={item} 
            tiers={tiers}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}
