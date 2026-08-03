import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

// 1. Smooth Animated Counter for Numbers
export function AnimatedCounter({ value, duration = 1.5, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const numericTarget = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Ease out expo formula for premium feel
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(easedProgress * numericTarget);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  const isDecimal = typeof value === 'number' && !Number.isInteger(value);
  const formatted = isDecimal ? displayValue.toFixed(2) : Math.round(displayValue);

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// 2. 3D Cursor Tilt Card Component
export function GlassTiltCard({ children, className = '', ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`glass-interactive ${className}`}
      {...props}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

// 3. Fluid Animated Ambient Mesh Gradient Background
export function EnergyBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Morphing Blob 1 */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 60, 0],
          scale: [1, 1.25, 0.9, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent blur-[120px]"
      />

      {/* Morphing Blob 2 */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.85, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-violet-600/20 via-purple-500/10 to-transparent blur-[140px]"
      />

      {/* Cyber Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} 
      />
    </div>
  );
}

// 4. Live Pulse Badge Dot
export function PulseBadge({ status = 'available', children }) {
  const isAvailable = status === 'available';
  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <motion.span
          animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className={`absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-amber-400'}`}
        />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      </span>
      {children}
    </div>
  );
}
