import React from 'react';

// Simple SVG particles background
const ParticlesBg = () => (
  <svg className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{opacity:0.18}}>
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
    </defs>
    {[...Array(18)].map((_, i) => (
      <circle key={i} cx={Math.random()*100+'%'} cy={Math.random()*100+'%'} r={Math.random()*60+20} fill="url(#g)" />
    ))}
  </svg>
);

export default ParticlesBg;
