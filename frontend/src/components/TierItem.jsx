import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function TierItem({ item, tiers, onItemClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  // Encontra a cor do tier de consenso
  const consensusTier = tiers.find(t => t.id === item.consensusTier);
  const consensusColor = consensusTier?.color || '#888';

  // Classes CSS
  const classes = [
    'tier-item',
    item.type === 'image' ? 'image-item' : 'text-item',
    isDragging && 'dragging',
    item.revealed && 'revealed'
  ].filter(Boolean).join(' ');

  // Estilo inline para imagem de fundo e cor de consenso
  const itemStyle = {
    ...style,
    ...(item.type === 'image' && { backgroundImage: `url(${item.content})` }),
    ...(item.revealed && { '--consensus-color': consensusColor })
  };

  // Handler de clique (abre modal)
  const handleClick = (e) => {
    // Só abre modal se não estiver arrastando
    if (!isDragging && onItemClick) {
      e.stopPropagation();
      onItemClick(item);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={classes}
      style={itemStyle}
      {...listeners}
      {...attributes}
      onClick={handleClick}
    >
      {item.type === 'text' && (
        <span>{item.content.length > 50 ? item.content.slice(0, 47) + '...' : item.content}</span>
      )}
      
      {/* Badge de consenso */}
      {item.revealed && item.consensusTier && (
        <div 
          className="consensus-badge"
          style={{ backgroundColor: consensusColor }}
        >
          {item.consensusTier}
        </div>
      )}
    </div>
  );
}
