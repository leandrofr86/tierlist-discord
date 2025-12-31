import React from 'react';

export function ImageModal({ item, isOpen, onClose, tiers }) {
  if (!isOpen || !item) return null;

  // Encontra a cor do tier de consenso
  const consensusTier = tiers?.find(t => t.id === item.consensusTier);
  const consensusColor = consensusTier?.color || '#888';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        {/* Botão fechar */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Conteúdo */}
        <div className="modal-content">
          {item.type === 'image' ? (
            <img 
              src={item.content} 
              alt="Visualização ampliada"
              className="modal-image"
              style={item.revealed ? { 
                borderColor: consensusColor,
                boxShadow: `0 0 30px ${consensusColor}`
              } : {}}
            />
          ) : (
            <div 
              className="modal-text"
              style={item.revealed ? { 
                borderColor: consensusColor,
                boxShadow: `0 0 30px ${consensusColor}`
              } : {}}
            >
              {item.content}
            </div>
          )}
        </div>

        {/* Informações do item */}
        <div className="modal-info">
          {item.revealed && item.reactions ? (
            <>
              <div className="modal-info-title">
                Votos da comunidade
                {item.consensusTier && (
                  <span 
                    className="modal-consensus-badge"
                    style={{ backgroundColor: consensusColor }}
                  >
                    {item.consensusTier}
                  </span>
                )}
              </div>
              <div className="modal-reactions">
                {Object.entries(item.reactions).map(([tier, count]) => (
                  <div key={tier} className="modal-reaction-item">
                    <span className="modal-reaction-tier">{tier}</span>
                    <span className="modal-reaction-count">{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="modal-info-pending">
              Classifique este item para ver os votos da comunidade
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
