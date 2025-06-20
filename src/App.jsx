import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BUTTON = `text-4xl md:text-5xl px-10 py-6 bg-cyan-400 neon-glow rounded-lg font-orbitron font-bold shadow-lg transition-all duration-200 hover:bg-cyan-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-300 mt-8`;

const getFeedback = (time) => {
  if (time < 200) return { emoji: '⚡', text: 'Insanely Fast!' };
  if (time < 400) return { emoji: '🎯', text: 'Great Reflex!' };
  if (time < 600) return { emoji: '🕒', text: 'Not bad, but try faster' };
  return { emoji: '🐢', text: 'Too slow... Try again!' };
};

const getRandomDelay = () => Math.random() * 3000 + 2000; // 2-5s

// Animated drifting starfield
function Starfield() {
  // Generate 60 stars with random positions and animation delays
  const stars = Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100 - 100; // start above the screen
    const delay = Math.random() * 16;
    const size = Math.random() * 2 + 1;
    return (
      <span
        key={i}
        style={{
          left: `${left}vw`,
          top: `${top}vh`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });
  return <div className="stars">{stars}</div>;
}

const bgVariants = {
  initial: { filter: 'brightness(1) blur(0px)' },
  animate: { filter: ['brightness(1) blur(0px)', 'brightness(1.2) blur(4px)', 'brightness(1) blur(0px)'], transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' } },
};

const LANGUAGES = {
  mn: { label: 'MN', flag: '🇲🇳' },
  jp: { label: 'JP', flag: '🇯🇵' },
  en: { label: 'EN', flag: '🇬🇧' },
};

const TEXT = {
  mn: {
    start: 'Тоглоом эхлүүлэх',
    click: 'ОДОО ДАР!',
    getReady: 'Бэлдээрэй...',
    tooSoon: 'Хэт эрт! Дахин оролдоорой.',
    playAgain: 'Дахин тоглох',
    yourTime: 'Таны хугацаа',
    fast: '⚡ Маш хурдан!',
    great: '🎯 Гайхалтай хурдан!',
    ok: '🕒 Дунд зэрэг, ахиад хичээгээрэй',
    slow: '🐢 Удаан байна... Дахин оролдоорой!',
    title: 'Хурд шалгах тоглоом',
  },
  jp: {
    start: 'ゲーム開始',
    click: '今クリック！',
    getReady: '準備して...',
    tooSoon: '早すぎます！もう一度。',
    playAgain: 'もう一度',
    yourTime: 'あなたのタイム',
    fast: '⚡ 超速い！',
    great: '🎯 すごい反応！',
    ok: '🕒 まあまあ、もっと頑張って',
    slow: '🐢 遅い... もう一度！',
    title: '反応速度ゲーム',
  },
  en: {
    start: 'Start Game',
    click: 'CLICK NOW!',
    getReady: 'Get Ready...',
    tooSoon: 'Too soon! Try Again.',
    playAgain: 'Play Again',
    yourTime: 'Your Time',
    fast: '⚡ Insanely Fast!',
    great: '🎯 Great Reflex!',
    ok: '🕒 Not bad, but try faster',
    slow: '🐢 Too slow... Try again!',
    title: 'Reaction Speed Game',
  },
};

const App = () => {
  const [gameState, setGameState] = useState('idle'); // idle, loading, ready, tooSoon, result
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [lang, setLang] = useState('mn');
  const langOrder = ['mn', 'jp', 'en'];
  const timeoutRef = useRef();
  const audioRef = useRef();
  const happyAudioRef = useRef();
  const slowAudioRef = useRef();
  const gtaAudioRef = useRef();

  useEffect(() => {
    if (gameState === 'loading') {
      timeoutRef.current = setTimeout(() => {
        setGameState('ready');
        setStartTime(Date.now());
      }, getRandomDelay());
      return () => clearTimeout(timeoutRef.current);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'ready' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [gameState]);

  const playButtonSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const playHappySound = () => {
    if (happyAudioRef.current) {
      happyAudioRef.current.currentTime = 0;
      happyAudioRef.current.play();
    }
  };

  const playSlowSound = () => {
    if (slowAudioRef.current) {
      slowAudioRef.current.currentTime = 0;
      slowAudioRef.current.play();
    }
  };

  const playGtaSound = () => {
    if (gtaAudioRef.current) {
      gtaAudioRef.current.currentTime = 0;
      gtaAudioRef.current.play();
    }
  };

  // CLICK NOW logic: 600ms-аас хурдан бол happy sound, удаан бол slow sound
  const handleClick = () => {
    if (gameState === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('result');
      if (time < 600) playHappySound();
      else playSlowSound();
    } else if (gameState === 'loading') {
      setGameState('tooSoon');
      clearTimeout(timeoutRef.current);
    }
  };

  const handleStart = () => {
    setGameState('loading');
    setReactionTime(null);
    setStartTime(null);
    playGtaSound();
  };
  // Stop all sounds when Play Again is clicked
  const stopAllSounds = () => {
    if (happyAudioRef.current) { happyAudioRef.current.pause(); happyAudioRef.current.currentTime = 0; }
    if (slowAudioRef.current) { slowAudioRef.current.pause(); slowAudioRef.current.currentTime = 0; }
    if (gtaAudioRef.current) { gtaAudioRef.current.pause(); gtaAudioRef.current.currentTime = 0; }
  };

  const handlePlayAgain = () => {
    stopAllSounds();
    setGameState('idle');
    setReactionTime(null);
    setStartTime(null);
    playGtaSound();
  };

  const nextLang = () => setLang(langOrder[(langOrder.indexOf(lang) + 1) % langOrder.length]);

  // Always render the same top-level background and starfield, regardless of game state
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <motion.div className="nebula-bg" variants={bgVariants} initial="initial" animate="animate" />
      <Starfield />
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/16/audio_12c6b6b6b2.mp3" preload="auto" />
      <audio ref={happyAudioRef} src="https://www.myinstants.com/media/sounds/happy-happy-happy-cat.mp3" preload="auto" />
      <audio ref={slowAudioRef} src="https://www.myinstants.com/media/sounds/6no2zhuan-yong.mp3" preload="auto" />
      <audio ref={gtaAudioRef} src="https://www.myinstants.com/media/sounds/gta-menu.mp3" preload="auto" />
      <div className="fullscreen-center">
        {gameState === 'result' && reactionTime !== null && (() => { const feedback = getFeedback(reactionTime); let feedbackText = feedback.text; if (lang==='mn') { if(feedback.emoji==='⚡') feedbackText=TEXT.mn.fast; else if(feedback.emoji==='🎯') feedbackText=TEXT.mn.great; else if(feedback.emoji==='🕒') feedbackText=TEXT.mn.ok; else feedbackText=TEXT.mn.slow; } if (lang==='jp') { if(feedback.emoji==='⚡') feedbackText=TEXT.jp.fast; else if(feedback.emoji==='🎯') feedbackText=TEXT.jp.great; else if(feedback.emoji==='🕒') feedbackText=TEXT.jp.ok; else feedbackText=TEXT.jp.slow; } else { if(feedback.emoji==='⚡') feedbackText=TEXT.en.fast; else if(feedback.emoji==='🎯') feedbackText=TEXT.en.great; else if(feedback.emoji==='🕒') feedbackText=TEXT.en.ok; else feedbackText=TEXT.en.slow; } return (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'2vw'}}>
            <h1 className="big-title">{TEXT[lang].yourTime}: {reactionTime}ms</h1>
            <p className="big-feedback">{feedback.emoji} {feedbackText}</p>
            <button className="big-btn" onClick={handlePlayAgain}>{TEXT[lang].playAgain}</button>
          </div>
        ); })()}
        {gameState === 'idle' && (
          <button className="big-btn" onClick={handleStart}>{TEXT[lang].start}</button>
        )}
        {gameState === 'loading' && (
          <>
            <div className="big-title" style={{fontSize: '5vw', color: '#00ffff'}}>{TEXT[lang].getReady}</div>
          </>
        )}
        {gameState === 'ready' && (
          <button className="big-btn" style={{background:'#e600ff', boxShadow:'0 0 80px #ff00ff'}} onClick={handleClick}>{TEXT[lang].click}</button>
        )}
        {gameState === 'tooSoon' && (
          <>
            <div className="big-feedback" style={{color:'#ff40b0'}}>{TEXT[lang].tooSoon}</div>
            <button className="big-btn" style={{background:'#222', color:'#ff40b0', boxShadow:'0 0 80px #ff40b0'}} onClick={handlePlayAgain}>{TEXT[lang].playAgain}</button>
          </>
        )}
      </div>
      {/* Add language toggle button (small, top-right) */}
      <div style={{position:'fixed',top:16,right:16,zIndex:100}}>
        <button
          style={{fontSize:'1.1rem',padding:'0.3em 0.7em',borderRadius:'1em',background:'#222b',color:'#fff',border:'none',cursor:'pointer',boxShadow:'0 0 8px #00fff7'}}
          onClick={nextLang}
          aria-label="Toggle language"
        >
          {LANGUAGES[lang].flag} {LANGUAGES[langOrder[(langOrder.indexOf(lang)+1)%langOrder.length]].flag}
        </button>
      </div>
    </div>
  );
};

export default App;
