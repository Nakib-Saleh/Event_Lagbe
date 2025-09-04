import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

// Replaced react-icons with inline SVGs to resolve the compilation error.
const FiZap = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const FiTarget = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
);
const FiAward = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-award"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 12 17 23 15.79 13.89"></polyline></svg>
);
const FiHeart = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);
const FiShield = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const FiX = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const FiRefreshCcw = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-ccw"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
);
const FiChevronsRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
);
const BiVolumeFull = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 15h2v3h2v-3h2v-2H8V9H6v2H4v2zm12 2a4 4 0 0 0 4-4H8v-2h12a4 4 0 0 0-4-4v2c2.21 0 4 1.79 4 4s-1.79 4-4 4v2z"></path></svg>
);
const BiVolumeMute = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 12a7 7 0 0 1-7 7V5a7 7 0 0 1 7 7zm-5-2v4h-2V9h2V7h-2V5h-2v14h4v-2h2v-4h-2v-2h2V9z"></path></svg>
);

const skillData = {
  101: { name: 'Fireball', icon: FiZap, color: '#ff6b6b' },
  102: { name: 'Ice Lance', icon: FiTarget, color: '#4d83ff' },
  103: { name: 'Healing Wave', icon: FiHeart, color: '#4cff6a' },
  104: { name: 'Mana Shield', icon: FiShield, color: '#f5c63d' },
  105: { name: 'Precision Shot', icon: FiTarget, color: '#ff9933' },
  106: { name: 'Holy Smite', icon: FiAward, color: '#fff9b5' },
  107: { name: 'Shadow Bolt', icon: FiZap, color: '#5e42a6' },
  108: { name: 'Stealth', icon: FiX, color: '#8a8a8a' },
  109: { name: 'Charge', icon: FiChevronsRight, color: '#e84d3b' },
  110: { name: 'Whirlwind', icon: FiRefreshCcw, color: '#a0a8b7' },
};

// Utility function to generate a random number
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Sound effect for skill activation
const useSoundEffect = (soundUrl) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (soundUrl) {
      const newAudio = new Audio(soundUrl);
      newAudio.volume = 0.1;
      setAudio(newAudio);
    }
  }, [soundUrl]);

  const playSound = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error('Audio play failed:', e));
    }
  }, [audio]);

  return playSound;
};

// Skill activation animation logic
const SkillAnimation = ({ skill, onComplete }) => {
  const { icon: Icon, name, color } = skill;
  const [isVisible, setIsVisible] = useState(true);
  const playSound = useSoundEffect('/path/to/activation-sound.mp3');

  const animationProps = useSpring({
    from: { opacity: 0, scale: 0.5, y: -50 },
    to: { opacity: 1, scale: 1, y: 0 },
    config: { tension: 300, friction: 10 },
    onRest: () => {
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 1000);
    },
  });

  useEffect(() => {
    playSound();
  }, [playSound]);

  if (!isVisible) return null;

  return (
    <animated.div
      style={{
        ...animationProps,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(5px)',
        borderRadius: '50%',
        padding: '2rem',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
    >
      <Icon size={80} style={{ color: color }} />
      <span className="text-xl font-bold text-white drop-shadow-lg">{name} Activated!</span>
    </animated.div>
  );
};

// Main SkillActivation component
const SkillActivation = () => {
  const [activeSkillId, setActiveSkillId] = useState(null);
  const [cooldowns, setCooldowns] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [playerStats, setPlayerStats] = useState({ health: 100, mana: 100 });
  const [enemyStats, setEnemyStats] = useState({ health: 150 });
  const [draggedSkill, setDraggedSkill] = useState(null);
  const [logMessages, setLogMessages] = useState([]);

  // Memoize skills to prevent unnecessary re-renders
  const skills = useMemo(() => Object.values(skillData), []);

  // Update player stats on skill activation
  const applySkillEffect = useCallback((skillId) => {
    const log = (message) => setLogMessages(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${message}`]);

    switch (skillId) {
      case 101: // Fireball
        setEnemyStats(prev => ({ ...prev, health: Math.max(0, prev.health - getRandomNumber(15, 25)) }));
        log('Fireball hits the enemy!');
        break;
      case 102: // Ice Lance
        setEnemyStats(prev => ({ ...prev, health: Math.max(0, prev.health - getRandomNumber(10, 18)) }));
        log('Ice Lance strikes the enemy!');
        break;
      case 103: // Healing Wave
        setPlayerStats(prev => ({ ...prev, health: Math.min(100, prev.health + getRandomNumber(20, 30)) }));
        log('You feel rejuvenated by the Healing Wave.');
        break;
      case 104: // Mana Shield
        setPlayerStats(prev => ({ ...prev, mana: Math.max(0, prev.mana - 10) }));
        log('Mana Shield activated, consuming mana.');
        break;
      case 105: // Precision Shot
        setEnemyStats(prev => ({ ...prev, health: Math.max(0, prev.health - getRandomNumber(20, 30)) }));
        log('Precision Shot lands a critical hit!');
        break;
      case 106: // Holy Smite
        setEnemyStats(prev => ({ ...prev, health: Math.max(0, prev.health - getRandomNumber(12, 22)) }));
        log('A holy light smites the enemy.');
        break;
      case 107: // Shadow Bolt
        setEnemyStats(prev => ({ ...prev, health: Math.max(0, prev.health - getRandomNumber(18, 28)) }));
        log('A shadowy bolt strikes the enemy.');
        break;
      case 108: // Stealth
        log('You slip into the shadows...');
        break;
      case 109: // Charge
        log('You charge the enemy!');
        break;
      case 110: // Whirlwind
        setEnemyStats(prev => ({ ...prev, health: Math.max(0, prev.health - getRandomNumber(25, 35)) }));
        log('Whirlwind strikes all nearby enemies!');
        break;
      default:
        break;
    }
  }, []);

  // Handle skill activation
  const activateSkill = useCallback((skillId) => {
    if (cooldowns[skillId]) {
      setLogMessages(prev => [...prev.slice(-4), 'Skill is on cooldown.']);
      return;
    }

    setActiveSkillId(skillId);
    applySkillEffect(skillId);

    // Set a random cooldown for the skill
    const newCooldown = getRandomNumber(3, 8) * 1000;
    setCooldowns(prev => ({ ...prev, [skillId]: new Date().getTime() + newCooldown }));
  }, [cooldowns, applySkillEffect]);

  // Handle drag and drop interaction
  const [{ x, y, isDragging }, drag] = useDrag(() => ({
    onDrag: ({ offset: [dx, dy] }) => {
      // Logic for visual feedback during drag
    },
    onDragEnd: ({ xy: [x, y], target }) => {
      // Simulate dropping on the target
      const dropTarget = document.getElementById('drop-zone');
      const dropZoneRect = dropTarget.getBoundingClientRect();

      if (x >= dropZoneRect.left && x <= dropZoneRect.right &&
          y >= dropZoneRect.top && y <= dropZoneRect.bottom) {
        if (draggedSkill) {
          activateSkill(draggedSkill.id);
        }
      }
      setDraggedSkill(null);
    }
  }));

  // Update cooldowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const newCooldowns = {};
        const now = new Date().getTime();
        for (const skillId in prev) {
          if (prev[skillId] > now) {
            newCooldowns[skillId] = prev[skillId];
          }
        }
        return newCooldowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Progress bar for player health and mana
  const ProgressBar = ({ label, value, max, color, bgColor }) => {
    const width = (value / max) * 100;
    return (
      <div className="w-full h-8 rounded-full shadow-inner overflow-hidden" style={{ backgroundColor: bgColor }}>
        <div
          className="h-full transition-all duration-300 ease-in-out flex items-center justify-center text-xs font-bold text-white"
          style={{ width: `${width}%`, backgroundColor: color }}
        >
          {label}: {value}/{max}
        </div>
      </div>
    );
  };

  // Main component rendering
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-inter">
      <div className="absolute top-4 right-4 z-50">
        <button
          className="p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors duration-200"
          onClick={() => setIsMuted(prev => !prev)}
        >
          {isMuted ? <BiVolumeMute size={24} /> : <BiVolumeFull size={24} />}
        </button>
      </div>
      
      {/* Skill Activation Display */}
      {activeSkillId && (
        <SkillAnimation
          skill={skillData[activeSkillId]}
          onComplete={() => setActiveSkillId(null)}
        />
      )}

      {/* Game UI */}
      <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
          Skill Activation Simulator
        </h1>

        {/* Player and Enemy Stats */}
        <div className="w-full flex justify-between items-center gap-4">
          <div className="w-1/2 p-4 bg-gray-700 rounded-xl shadow-lg flex flex-col gap-2">
            <h2 className="text-lg font-bold">Player</h2>
            <ProgressBar
              label="Health"
              value={playerStats.health}
              max={100}
              color="#4cff6a"
              bgColor="#2d3748"
            />
            <ProgressBar
              label="Mana"
              value={playerStats.mana}
              max={100}
              color="#4d83ff"
              bgColor="#2d3748"
            />
          </div>
          <div className="w-1/2 p-4 bg-gray-700 rounded-xl shadow-lg flex flex-col gap-2">
            <h2 className="text-lg font-bold">Enemy</h2>
            <ProgressBar
              label="Health"
              value={enemyStats.health}
              max={150}
              color="#ff6b6b"
              bgColor="#2d3748"
            />
          </div>
        </div>

        {/* Action Log */}
        <div className="w-full p-4 bg-gray-700 rounded-xl shadow-lg overflow-y-auto h-32">
          <h2 className="text-lg font-bold mb-2">Action Log</h2>
          <div className="flex flex-col-reverse gap-1 text-sm text-gray-300">
            {logMessages.map((msg, index) => (
              <p key={index} className="animate-fadeIn">{msg}</p>
            ))}
          </div>
        </div>

        {/* Skill Drag & Drop Zone */}
        <div
          id="drop-zone"
          className="w-full h-40 border-4 border-dashed border-gray-500 rounded-xl flex items-center justify-center text-center text-gray-500 font-bold text-lg transition-all duration-300"
          style={{
            borderColor: draggedSkill ? 'white' : 'transparent',
            backgroundColor: draggedSkill ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            boxShadow: draggedSkill ? '0 0 15px rgba(255, 255, 255, 0.5)' : 'none',
          }}
        >
          Drop skill here to activate
        </div>

        {/* Skill Bar */}
        <div className="w-full grid grid-cols-5 gap-4 mt-4">
          {skills.map(skill => {
            const { id, name, icon: Icon, color } = skill;
            const cooldown = cooldowns[id];
            const onCooldown = !!cooldown;
            const remainingCooldown = onCooldown ? Math.ceil((cooldown - new Date().getTime()) / 1000) : 0;
            const cooldownStyle = onCooldown ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 transform';

            // Drag bind
            const bind = useDrag(({ down, movement: [mx, my], event }) => {
              if (down) {
                setDraggedSkill(skill);
                // Prevent scrolling while dragging
                event.preventDefault();
              }
              return { x: mx, y: my };
            }, {
              from: () => [0, 0],
              bounds: { top: -window.innerHeight, bottom: window.innerHeight, left: -window.innerWidth, right: window.innerWidth },
              filterTaps: true
            });

            return (
              <animated.div
                key={id}
                className={`relative w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 border-gray-600 shadow-xl ${cooldownStyle}`}
                style={{
                  ...draggedSkill?.id === id ? { x, y, zIndex: 50, position: 'relative' } : {},
                  backgroundColor: color,
                }}
                onClick={() => !onCooldown && activateSkill(id)}
                {...bind()}
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <Icon size={40} className="drop-shadow-sm text-white" />
                  <span className="text-xs font-bold text-center mt-1 text-white truncate w-full px-1">
                    {name}
                  </span>
                </div>
                {onCooldown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white font-bold text-2xl rounded-2xl">
                    {remainingCooldown}s
                  </div>
                )}
              </animated.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillActivation;
