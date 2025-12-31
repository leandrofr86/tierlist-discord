import React, { useState, useEffect } from 'react';

export function ConfigPanel({ isOpen, tier, onClose, onSave }) {
  const [letter, setLetter] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [color, setColor] = useState('#ff7f7f');

  useEffect(() => {
    if (tier) {
      setLetter(tier.id);
      setSubtitle(tier.subtitle || '');
      setColor(tier.color);
    }
  }, [tier]);

  const handleSave = () => {
    if (tier) {
      onSave({
        ...tier,
        id: letter.toUpperCase().slice(0, 2), // Máximo 2 caracteres
        subtitle: subtitle.trim(),
        color
      });
    }
    onClose();
  };

  return (
    <>
      <div 
        className={`config-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`config-panel ${isOpen ? 'open' : ''}`}>
        <h2 className="config-title">Configurar Tier</h2>
        
        <div className="config-group">
          <label className="config-label">Letra do Tier</label>
          <input
            type="text"
            className="config-input config-input-letter"
            value={letter}
            onChange={(e) => setLetter(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="S"
            maxLength={2}
          />
          <span className="config-hint">Máximo 2 caracteres (ex: S, A, B+)</span>
        </div>

        <div className="config-group">
          <label className="config-label">Subtítulo (opcional)</label>
          <input
            type="text"
            className="config-input"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ex: Obra-prima, Excelente, Muito bom..."
          />
          <span className="config-hint">Descrição que aparece abaixo da letra</span>
        </div>

        <div className="config-group">
          <label className="config-label">Cor</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              className="color-picker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              type="text"
              className="config-input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#ff7f7f"
            />
          </div>
        </div>

        <div className="config-group">
          <label className="config-label">Preview</label>
          <div className="config-preview">
            <div 
              className="tier-label preview-label"
              style={{ 
                backgroundColor: color,
                width: '100px',
                minWidth: '100px',
                height: '80px'
              }}
            >
              <span className="tier-letter">{letter || 'S'}</span>
              {subtitle && (
                <span className="tier-subtitle">{subtitle}</span>
              )}
            </div>
          </div>
        </div>

        <div className="config-buttons">
          <button className="config-btn secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="config-btn primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </>
  );
}
