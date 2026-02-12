'use client';
import { useEffect, useRef } from 'react';

export default function MatrixRain({ active }) {
  const ref = useRef(null);
  const anim = useRef(null);
  const drops = useRef([]);

  useEffect(() => {
    if (!active) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      drops.current = Array(Math.floor(c.width / 15)).fill(1);
    };
    resize();
    window.addEventListener('resize', resize);
    const ch = 'アカサタナハマヤラワ0123456789APEX◬◈';
    const draw = () => {
      ctx.fillStyle = 'rgba(0,8,0,0.05)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = '13px monospace';
      for (let i = 0; i < drops.current.length; i++) {
        ctx.fillStyle = Math.random() > 0.97 ? '#fff' : '#00ff4150';
        ctx.fillText(ch[Math.floor(Math.random() * ch.length)], i * 15, drops.current[i] * 15);
        if (drops.current[i] * 15 > c.height && Math.random() > 0.976) drops.current[i] = 0;
        drops.current[i]++;
      }
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(anim.current); window.removeEventListener('resize', resize); };
  }, [active]);

  if (!active) return null;
  return <canvas ref={ref} className="fixed inset-0 z-0 opacity-30 pointer-events-none" />;
}
