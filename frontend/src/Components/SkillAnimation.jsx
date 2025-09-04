import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

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
const FiDroplet = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-droplet"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69z"></path></svg>
);
const FiSun = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);
const FiMoon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);
const FiWind = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-wind"><path d="M9.59 4.59A2 2 0 1 1 11.41 11.41M4.59 9.59A2 2 0 1 1 11.41 11.41M12 12s2 4 4 4m-4-4l-2 2-2 2"></path></svg>
);
const FiZapOff = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap-off"><polyline points="12.41 6.75 13 2 10 12 4.41 12"></polyline><line x1="18" y1="18" x2="6" y2="6"></line><polyline points="16.5 14.5 21 10 11 10 12 22 13 22"></polyline></svg>
);
const FiCloudOff = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-cloud-off"><path d="M22.61 14.34a7.93 7.93 0 0 0-4.49-1.9H18c-2.42 0-4.42 1.7-4.99 4.09"></path><path d="M4 14.34a7.93 7.93 0 0 1-.95-1.12"></path><path d="M11 6.34A7.93 7.93 0 0 0 3.39 12.33"></path><path d="M12 2C9.44 2 7 3.5 5 6a8 8 0 0 0-2.34 6"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

// --- Skill Data ---
// Expanded skill data with more skills, damage, mana cost, and cooldown.
const skillData = {
  101: { name: 'Fireball', icon: FiZap, color: '#ff6b6b', damage: 20, manaCost: 15, cooldown: 5 },
  102: { name: 'Ice Lance', icon: FiDroplet, color: '#4d83ff', damage: 15, manaCost: 10, cooldown: 3 },
  103: { name: 'Healing Wave', icon: FiHeart, color: '#4cff6a', damage: -25, manaCost: 20, cooldown: 8 },
  104: { name: 'Mana Shield', icon: FiShield, color: '#f5c63d', damage: 0, manaCost: 10, cooldown: 15 },
  105: { name: 'Precision Shot', icon: FiTarget, color: '#ff9933', damage: 30, manaCost: 20, cooldown: 10 },
  106: { name: 'Holy Smite', icon: FiAward, color: '#fff9b5', damage: 22, manaCost: 18, cooldown: 7 },
  107: { name: 'Shadow Bolt', icon: FiMoon, color: '#5e42a6', damage: 28, manaCost: 25, cooldown: 12 },
  108: { name: 'Stealth', icon: FiX, color: '#8a8a8a', damage: 0, manaCost: 5, cooldown: 30 },
  109: { name: 'Charge', icon: FiChevronsRight, color: '#e84d3b', damage: 15, manaCost: 10, cooldown: 6 },
  110: { name: 'Whirlwind', icon: FiRefreshCcw, color: '#a0a8b7', damage: 35, manaCost: 30, cooldown: 20 },
  111: { name: 'Solar Flare', icon: FiSun, color: '#ffeb3b', damage: 40, manaCost: 40, cooldown: 25 },
  112: { name: 'Wind Shear', icon: FiWind, color: '#90caf9', damage: 18, manaCost: 12, cooldown: 4 },
  113: { name: 'Mana Burn', icon: FiZapOff, color: '#7e57c2', damage: 10, manaCost: 0, cooldown: 5 },
  114: { name: 'Cloud Cover', icon: FiCloudOff, color: '#cfd8dc', damage: 0, manaCost: 15, cooldown: 18 },
  115: { name: 'Explosion', icon: FiZap, color: '#ff5722', damage: 50, manaCost: 50, cooldown: 40 },
};

// --- Utility Functions ---
// Generates a random number within a specified range.
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Custom Hooks ---
// Hook for managing and playing a sound effect.
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

// --- Sub-Components for a Cleaner UI ---
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

const PlayerStats = ({ stats }) => (
  <div className="w-1/2 p-4 bg-gray-700 rounded-xl shadow-lg flex flex-col gap-2">
    <h2 className="text-lg font-bold text-center">Player</h2>
    <ProgressBar
      label="Health"
      value={stats.health}
      max={stats.maxHealth}
      color="#4cff6a"
      bgColor="#2d3748"
    />
    <ProgressBar
      label="Mana"
      value={stats.mana}
      max={stats.maxMana}
      color="#4d83ff"
      bgColor="#2d3748"
    />
    <ProgressBar
      label="XP"
      value={stats.xp}
      max={stats.xpToNextLevel}
      color="#ffc107"
      bgColor="#2d3748"
    />
  </div>
);

const EnemyStats = ({ stats }) => (
  <div className="w-1/2 p-4 bg-gray-700 rounded-xl shadow-lg flex flex-col gap-2">
    <h2 className="text-lg font-bold text-center">Enemy</h2>
    <ProgressBar
      label="Health"
      value={stats.health}
      max={stats.maxHealth}
      color="#ff6b6b"
      bgColor="#2d3748"
    />
  </div>
);

const Tooltip = ({ skill, position }) => {
  if (!skill) return null;
  return (
    <div
      className="absolute bg-gray-900 text-white text-xs rounded p-2 shadow-lg z-50 transition-opacity duration-300"
      style={{
        top: position.y + 10,
        left: position.x + 10,
        pointerEvents: 'none',
      }}
    >
      <p className="font-bold text-sm mb-1">{skill.name}</p>
      <p>Damage: {skill.damage}</p>
      <p>Mana Cost: {skill.manaCost}</p>
      <p>Cooldown: {skill.cooldown}s</p>
    </div>
  );
};

// --- Main Components ---
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
    if (!isVisible) return;
    playSound();
  }, [playSound, isVisible]);

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

const SkillActivation = () => {
  // --- State Management ---
  const [activeSkillId, setActiveSkillId] = useState(null);
  const [cooldowns, setCooldowns] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    health: 100, maxHealth: 100,
    mana: 100, maxMana: 100,
    level: 1, xp: 0, xpToNextLevel: 100,
    strength: 10, intelligence: 10, defense: 5
  });
  const [enemyStats, setEnemyStats] = useState({ health: 150, maxHealth: 150 });
  const [draggedSkill, setDraggedSkill] = useState(null);
  const [logMessages, setLogMessages] = useState([]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const playerRef = useRef(null);
  const enemyRef = useRef(null);

  // Memoize skills to prevent unnecessary re-renders.
  const skills = useMemo(() => Object.values(skillData), []);

  // --- Combat and Game Logic ---
  const log = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev.slice(-9), { message: `[${timestamp}] ${message}`, type }]);
  }, []);

  const gainXP = useCallback((amount) => {
    setPlayerStats(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;

      if (newXp >= newXpToNextLevel) {
        newLevel += 1;
        newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
        log(`You leveled up! You are now level ${newLevel}.`, 'success');
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpToNextLevel,
      };
    });
  }, [log]);

  const applySkillEffect = useCallback((skillId) => {
    const skill = skillData[skillId];
    if (!skill) return;

    // Check if player has enough mana.
    if (playerStats.mana < skill.manaCost) {
      log('Not enough mana to cast that spell.', 'error');
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      mana: Math.max(0, prev.mana - skill.manaCost),
    }));

    // Apply skill effect based on type.
    if (skill.damage > 0) { // Offensive skill
      const damageMultiplier = playerStats.intelligence / 10;
      const finalDamage = Math.max(1, Math.floor(skill.damage * damageMultiplier));
      setEnemyStats(prev => {
        const newHealth = Math.max(0, prev.health - finalDamage);
        if (newHealth === 0) {
          log('The enemy has been defeated!', 'success');
          gainXP(50); // Award XP for defeating the enemy
        } else {
          log(`${skill.name} hits the enemy for ${finalDamage} damage!`, 'damage');
        }
        return { ...prev, health: newHealth };
      });
    } else if (skill.damage < 0) { // Healing skill
      const healingMultiplier = playerStats.intelligence / 10;
      const finalHealing = Math.floor(Math.abs(skill.damage) * healingMultiplier);
      setPlayerStats(prev => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + finalHealing),
      }));
      log(`${skill.name} heals you for ${finalHealing} health.`, 'healing');
    } else { // Utility skill
      log(`${skill.name} activated.`, 'utility');
    }

  }, [playerStats.mana, playerStats.intelligence, log, gainXP]);

  // Handle skill activation
  const activateSkill = useCallback((skillId) => {
    if (cooldowns[skillId] && cooldowns[skillId] > new Date().getTime()) {
      log('Skill is on cooldown.', 'warning');
      return;
    }

    setActiveSkillId(skillId);
    applySkillEffect(skillId);

    // Set a cooldown for the skill based on its data.
    const skill = skillData[skillId];
    if (skill) {
      const newCooldownTime = new Date().getTime() + skill.cooldown * 1000;
      setCooldowns(prev => ({ ...prev, [skillId]: newCooldownTime }));
    }
  }, [cooldowns, applySkillEffect, log]);

  // --- Drag and Drop Logic ---
  const [{ x, y, isDragging }, drag] = useDrag(() => ({
    onDrag: ({ event, xy }) => {
      // Update tooltip position while dragging.
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    },
    onDragEnd: ({ xy: [endX, endY] }) => {
      const dropTarget = document.getElementById('drop-zone');
      const dropZoneRect = dropTarget.getBoundingClientRect();

      // Check if the drop was within the drop zone.
      if (endX >= dropZoneRect.left && endX <= dropZoneRect.right &&
          endY >= dropZoneRect.top && endY <= dropZoneRect.bottom) {
        if (draggedSkill) {
          activateSkill(draggedSkill.id);
        }
      }
      setDraggedSkill(null);
      setIsTooltipVisible(false);
    }
  }));

  // --- Game Loop / AI ---
  // Simple enemy AI that attacks the player.
  useEffect(() => {
    const enemyAttack = setInterval(() => {
      setPlayerStats(prev => {
        if (enemyStats.health <= 0) {
          clearInterval(enemyAttack);
          return prev;
        }
        const damage = getRandomNumber(5, 15);
        log(`Enemy attacks you for ${damage} damage.`, 'enemy-damage');
        return { ...prev, health: Math.max(0, prev.health - damage) };
      });
    }, 4000); // Enemy attacks every 4 seconds.

    return () => clearInterval(enemyAttack);
  }, [log, enemyStats.health]);

  // Update cooldowns every second.
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

  // Check for game over.
  useEffect(() => {
    if (playerStats.health <= 0) {
      log('Game Over. You have been defeated.', 'error');
      // Reset game after a delay
      setTimeout(() => {
        setPlayerStats({
          health: 100, maxHealth: 100,
          mana: 100, maxMana: 100,
          level: 1, xp: 0, xpToNextLevel: 100,
          strength: 10, intelligence: 10, defense: 5
        });
        setEnemyStats({ health: 150, maxHealth: 150 });
        setCooldowns({});
        setLogMessages([]);
        log('Game has been reset.', 'info');
      }, 5000);
    }
  }, [playerStats.health, log]);

  // --- Rendering Logic ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-inter relative">
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

      {/* Tooltip for skill details */}
      {isTooltipVisible && <Tooltip skill={hoveredSkill} position={tooltipPosition} />}

      {/* Main Game UI Container */}
      <div className="w-full max-w-6xl p-6 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
          Skill Activation Simulator
        </h1>
        <p className="text-center text-sm text-gray-400 mb-4">Drag a skill to the drop zone to activate it.</p>

        {/* Player and Enemy Combatants */}
        <div className="w-full flex justify-around items-end h-64 relative">
          {/* Player Character */}
          <div ref={playerRef} className="flex flex-col items-center text-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 mb-2">
              <circle cx="50" cy="50" r="40" fill="#4c4cff" stroke="#333" strokeWidth="2" />
              <text x="50" y="55" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#fff">P1</text>
            </svg>
            <span className="font-bold">Level {playerStats.level}</span>
          </div>

          {/* VS label */}
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-gray-600">
            VS
          </div>

          {/* Enemy Character */}
          <div ref={enemyRef} className="flex flex-col items-center text-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 mb-2">
              <path d="M50 10 L80 90 L20 90 Z" fill="#ff4d4d" stroke="#333" strokeWidth="2" />
              <text x="50" y="65" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#fff">E</text>
            </svg>
            <span className="font-bold">Enemy</span>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="w-full flex justify-between items-start gap-6">
          <PlayerStats stats={playerStats} />
          <EnemyStats stats={enemyStats} />
        </div>

        {/* Action Log */}
        <div className="w-full p-4 bg-gray-700 rounded-xl shadow-lg overflow-y-auto h-40 mt-4">
          <h2 className="text-lg font-bold mb-2">Action Log</h2>
          <div className="flex flex-col-reverse gap-1 text-sm text-gray-300">
            {logMessages.map((entry, index) => (
              <p key={index} className={`animate-fadeIn ${
                entry.type === 'damage' ? 'text-red-300' :
                entry.type === 'healing' ? 'text-green-300' :
                entry.type === 'error' ? 'text-orange-400 font-bold' :
                entry.type === 'warning' ? 'text-yellow-300' :
                entry.type === 'success' ? 'text-green-400 font-bold' :
                'text-gray-300'
              }`}>
                {entry.message}
              </p>
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
        <div className="w-full grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 mt-4">
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
                setIsTooltipVisible(true);
                setHoveredSkill(skill);
                event.preventDefault(); // Prevent scrolling while dragging
              } else {
                setDraggedSkill(null);
                setIsTooltipVisible(false);
                setHoveredSkill(null);
              }
              return { x: mx, y: my };
            }, {
              from: () => [0, 0],
              bounds: { top: -window.innerHeight, bottom: window.innerHeight, left: -window.innerWidth, right: window.innerWidth },
              filterTaps: true,
              eventOptions: { passive: false }
            });

            return (
              <animated.div
                key={id}
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center border-2 border-gray-600 shadow-xl transition-all duration-200 ${cooldownStyle}`}
                style={{
                  ...draggedSkill?.id === id ? { x, y, zIndex: 50, position: 'relative' } : {},
                  backgroundColor: color,
                }}
                onClick={() => !onCooldown && activateSkill(id)}
                onMouseEnter={(e) => {
                  setHoveredSkill(skill);
                  setIsTooltipVisible(true);
                  setTooltipPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                  setHoveredSkill(null);
                  setIsTooltipVisible(false);
                }}
                {...bind()}
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <Icon size={40} className="drop-shadow-sm text-white" />
                  <span className="text-[0.6rem] md:text-xs font-bold text-center mt-1 text-white truncate w-full px-1">
                    {name}
                  </span>
                </div>
                {onCooldown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white font-bold text-xl rounded-2xl">
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
