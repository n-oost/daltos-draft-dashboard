import React, { useEffect, useRef, useState, memo } from 'react';
import { generateHash } from '../utils/hashGenerator';
import type { VisualTraits } from '../types';

interface PixelAvatarProps {
  name: string;
  size?: number;
  traits?: VisualTraits;
}

const SKIN_TONES = ['#f8d9ce', '#f0c0b4', '#e0ac69', '#8d5524', '#523418'];
const HAIR_COLORS = ['#000000', '#4a3728', '#e6cea8', '#b55239', '#888888'];

const PixelAvatar: React.FC<PixelAvatarProps> = memo(({ name, size = 48, traits }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use traits if provided, otherwise fallback to hash
    const hash = generateHash(name);
    
    const skinColor = traits?.skinTone !== undefined 
        ? SKIN_TONES[traits.skinTone] 
        : SKIN_TONES[hash % SKIN_TONES.length];
        
    const hairColor = traits?.hairColor !== undefined 
        ? HAIR_COLORS[traits.hairColor] 
        : HAIR_COLORS[(hash >> 2) % HAIR_COLORS.length];
        
    const mouthType = traits?.mouthType !== undefined 
        ? traits.mouthType 
        : (hash >> 6) % 3;

    const eyeColor = (hash >> 4) % 2 === 0 ? '#000' : '#2c3e50';

    const w = 8;
    const h = 8;
    
    ctx.fillStyle = '#3e2a5f';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = skinColor;
    ctx.fillRect(1, 1, 6, 7);

    ctx.fillStyle = eyeColor;
    ctx.fillRect(2, 3, 1, 1);
    ctx.fillRect(5, 3, 1, 1);

    ctx.fillStyle = hairColor;
    ctx.fillRect(1, 0, 6, 2);
    ctx.fillRect(0, 1, 1, 2);
    ctx.fillRect(7, 1, 1, 2);

    ctx.fillStyle = 'rgba(74, 55, 40, 0.5)';
    if (mouthType === 0) {
        ctx.fillRect(3, 5, 2, 1);
    } else if (mouthType === 1) {
        ctx.fillRect(2, 5, 1, 1);
        ctx.fillRect(5, 5, 1, 1);
        ctx.fillRect(3, 6, 2, 1);
    } else {
        ctx.fillRect(3, 5, 2, 2);
    }

    setDataUrl(canvas.toDataURL());

  }, [name, traits]);

  return (
    <div 
      className="border-2 border-white/20 rounded-md bg-white/10 overflow-hidden shrink-0"
      style={{ width: size, height: size }}
      title={name}
    >
      <canvas ref={canvasRef} width={8} height={8} className="hidden" />
      {dataUrl ? (
        <img 
            src={dataUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
            style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <div className="w-full h-full bg-deep-purple animate-pulse" />
      )}
    </div>
  );
}, (prev, next) => 
    prev.name === next.name && 
    prev.size === next.size && 
    JSON.stringify(prev.traits) === JSON.stringify(next.traits)
);

export default PixelAvatar;
