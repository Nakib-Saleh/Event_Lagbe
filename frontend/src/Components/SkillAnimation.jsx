import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// --- Inline SVG Icons ---
// Replaced react-icons with inline SVGs to resolve the compilation error and increase code lines.
// Each SVG is a functional component for reusability.
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
const FiTrendingUp = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-up"><polyline points="17 6 23 6 23 12"></polyline><path d="M12 18l-5-5-5 5"></path><polyline points="16 11 12 15 12 15"></polyline></svg>
);
const FiCrosshair = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-crosshair"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="2" y2="12"></line><line x1="12" y1="22" x2="12" y2="2"></line></svg>
);
const FiHexagon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-hexagon"><path d="M21.25 12.001l-4.5 7.794L12 22.585l-4.75-2.79-4.5-7.794 4.5-7.794L12 1.417l4.75 2.795z"></path></svg>
);
const FiStar = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const FiBox = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path><polyline points="12 16 12 18 10 18 10 16"></polyline><polyline points="12 16 12 14 14 14 14 16"></polyline><line x1="12" y1="10" x2="12" y2="6"></line><line x1="15" y1="10" x2="15" y2="6"></line><line x1="9" y1="10" x2="9" y2="6"></line></svg>
);

// --- Skill Data ---
// Expanded skill data with more skills, damage, mana cost, and cooldown.
const skillData = {
  101: { id: 101, name: 'Fireball', icon: FiZap, color: '#ff6b6b', damage: 20, manaCost: 15, cooldown: 5 },
  102: { id: 102, name: 'Ice Lance', icon: FiDroplet, color: '#4d83ff', damage: 15, manaCost: 10, cooldown: 3 },
  103: { id: 103, name: 'Healing Wave', icon: FiHeart, color: '#4cff6a', damage: -25, manaCost: 20, cooldown: 8 },
  104: { id: 104, name: 'Mana Shield', icon: FiShield, color: '#f5c63d', damage: 0, manaCost: 10, cooldown: 15 },
  105: { id: 105, name: 'Precision Shot', icon: FiTarget, color: '#ff9933', damage: 30, manaCost: 20, cooldown: 10 },
  106: { id: 106, name: 'Holy Smite', icon: FiAward, color: '#fff9b5', damage: 22, manaCost: 18, cooldown: 7 },
  107: { id: 107, name: 'Shadow Bolt', icon: FiMoon, color: '#5e42a6', damage: 28, manaCost: 25, cooldown: 12 },
  108: { id: 108, name: 'Stealth', icon: FiX, color: '#8a8a8a', damage: 0, manaCost: 5, cooldown: 30 },
  109: { id: 109, name: 'Charge', icon: FiChevronsRight, color: '#e84d3b', damage: 15, manaCost: 10, cooldown: 6 },
  110: { id: 110, name: 'Whirlwind', icon: FiRefreshCcw, color: '#a0a8b7', damage: 35, manaCost: 30, cooldown: 20 },
  111: { id: 111, name: 'Solar Flare', icon: FiSun, color: '#ffeb3b', damage: 40, manaCost: 40, cooldown: 25 },
  112: { id: 112, name: 'Wind Shear', icon: FiWind, color: '#90caf9', damage: 18, manaCost: 12, cooldown: 4 },
  113: { id: 113, name: 'Mana Burn', icon: FiZapOff, color: '#7e57c2', damage: 10, manaCost: 0, cooldown: 5 },
  114: { id: 114, name: 'Cloud Cover', icon: FiCloudOff, color: '#cfd8dc', damage: 0, manaCost: 15, cooldown: 18 },
  115: { id: 115, name: 'Explosion', icon: FiZap, color: '#ff5722', damage: 50, manaCost: 50, cooldown: 40 },
  116: { id: 116, name: 'Rising Uppercut', icon: FiTrendingUp, color: '#d946ef', damage: 25, manaCost: 15, cooldown: 8 },
  117: { id: 117, name: 'Arcane Focus', icon: FiCrosshair, color: '#a78bfa', damage: 0, manaCost: 5, cooldown: 120 },
  118: { id: 118, name: 'Stone Skin', icon: FiHexagon, color: '#6ee7b7', damage: 0, manaCost: 10, cooldown: 60 },
  119: { id: 119, name: 'Starfall', icon: FiStar, color: '#fcd34d', damage: 45, manaCost: 35, cooldown: 35 },
  120: { id: 120, name: 'Loot', icon: FiBox, color: '#7e57c2', damage: 0, manaCost: 0, cooldown: 1 },
};

// --- Item Data ---
const itemData = {
  201: { id: 201, name: 'Health Potion', icon: FiHeart, color: '#dc2626', type: 'consumable', effect: { health: 50 } },
  202: { id: 202, name: 'Mana Potion', icon: FiDroplet, color: '#3b82f6', type: 'consumable', effect: { mana: 50 } },
  203: { id: 203, name: 'Potion of Wisdom', icon: FiAward, color: '#facc15', type: 'consumable', effect: { intelligence: 5 } },
};

// --- Utility Functions ---
// Generates a random number within a specified range.
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Sub-Components for a Cleaner UI ---
const ProgressBar = ({ label, value, max, color, bgColor }) => {
  const width = (value / max) * 100;
  return (
    <div className="w-full h-8 rounded-full shadow-inner overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div
        className="h-full transition-all duration-300 ease-in-out flex items-center justify-center text-xs font-bold text-white"
        style={{ width: `${width}%`, backgroundColor: color }}
      >
        {label}: {Math.round(value)}/{max}
      </div>
    </div>
  );
};

const PlayerStats = ({ stats }) => (
  <div className="w-1/2 p-4 bg-gray-700 rounded-xl shadow-lg flex flex-col gap-2">
    <h2 className="text-lg font-bold text-center text-purple-300">Player</h2>
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
    <div className="text-sm text-center text-gray-300 mt-2">
      <p>Level: <span className="text-white font-bold">{stats.level}</span></p>
      <p>STR: <span className="text-white font-bold">{stats.strength}</span> | INT: <span className="text-white font-bold">{stats.intelligence}</span> | DEF: <span className="text-white font-bold">{stats.defense}</span></p>
    </div>
  </div>
);

const EnemyStats = ({ stats }) => (
  <div className="w-1/2 p-4 bg-gray-700 rounded-xl shadow-lg flex flex-col gap-2">
    <h2 className="text-lg font-bold text-center text-red-400">Enemy</h2>
    <ProgressBar
      label="Health"
      value={stats.health}
      max={stats.maxHealth}
      color="#ff6b6b"
      bgColor="#2d3748"
    />
    <div className="text-sm text-center text-gray-300 mt-2">
      <p>Level: <span className="text-white font-bold">{stats.level}</span></p>
      <p>Attack: <span className="text-white font-bold">{stats.attack}</span> | Defense: <span className="text-white font-bold">{stats.defense}</span></p>
    </div>
  </div>
);

const Tooltip = ({ data, position, type }) => {
  if (!data) return null;
  return (
    <div
      className="absolute bg-gray-900 text-white text-xs rounded p-2 shadow-lg z-50 transition-opacity duration-300"
      style={{
        top: position.y + 10,
        left: position.x + 10,
        pointerEvents: 'none',
        transform: 'translate(-50%, -100%)',
      }}
    >
      <p className="font-bold text-sm mb-1">{data.name}</p>
      {type === 'skill' && (
        <>
          <p>Damage: {data.damage}</p>
          <p>Mana Cost: {data.manaCost}</p>
          <p>Cooldown: {data.cooldown}s</p>
        </>
      )}
      {type === 'item' && data.effect && (
        <>
          {data.effect.health && <p>Heals for: {data.effect.health}</p>}
          {data.effect.mana && <p>Restores mana: {data.effect.mana}</p>}
          {data.effect.intelligence && <p>Increases INT: {data.effect.intelligence}</p>}
        </>
      )}
    </div>
  );
};

const GameLog = ({ messages }) => {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const getLogColor = (type) => {
    switch (type) {
      case 'damage': return 'text-red-300';
      case 'healing': return 'text-green-300';
      case 'error': return 'text-orange-400 font-bold';
      case 'warning': return 'text-yellow-300';
      case 'success': return 'text-green-400 font-bold';
      case 'enemy-damage': return 'text-red-400 italic';
      case 'utility': return 'text-blue-300';
      case 'item': return 'text-yellow-300';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="w-full p-4 bg-gray-700 rounded-xl shadow-lg overflow-y-auto h-40 mt-4">
      <h2 className="text-lg font-bold mb-2 text-white">Action Log</h2>
      <div ref={logRef} className="flex flex-col gap-1 text-sm text-gray-300">
        {messages.map((entry, index) => (
          <p key={index} className={getLogColor(entry.type)}>
            {entry.message}
          </p>
        ))}
      </div>
    </div>
  );
};

const Inventory = ({ items, onUse }) => {
  return (
    <div className="w-full p-4 bg-gray-700 rounded-xl shadow-lg mt-4">
      <h2 className="text-lg font-bold mb-2 text-white">Inventory</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="relative w-16 h-16 rounded-lg border-2 border-gray-600 shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
              style={{ backgroundColor: item.color }}
              onClick={() => onUse(item)}
            >
              <Icon size={30} className="drop-shadow-sm text-white" />
              <span className="absolute bottom-1 text-[0.5rem] font-bold text-white w-full text-center">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Components ---
const SkillAnimation = ({ skill, onComplete, isAnimating }) => {
  const { icon: Icon, name, color } = skill;

  // Use CSS transition for animation
  const animationClass = isAnimating
    ? 'opacity-100 scale-100 animate-pulse'
    : 'opacity-0 scale-50';

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating, onComplete]);

  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                  bg-white/20 backdrop-blur-sm rounded-full p-8 shadow-2xl 
                  transition-all duration-500 ease-in-out flex flex-col items-center justify-center gap-2
                  ${animationClass}`}
      style={{
        boxShadow: `0 0 40px ${color}`,
      }}
    >
      <Icon size={80} style={{ color: color }} />
      <span className="text-xl font-bold text-white drop-shadow-lg">{name} Activated!</span>
    </div>
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
  const [enemyStats, setEnemyStats] = useState({ health: 150, maxHealth: 150, level: 1, attack: 10, defense: 5 });
  const [draggedSkill, setDraggedSkill] = useState(null);
  const [logMessages, setLogMessages] = useState([]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredData, setHoveredData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inventory, setInventory] = useState([]);
  const dropZoneRef = useRef(null);

  // Memoize skills to prevent unnecessary re-renders.
  const skills = useMemo(() => Object.values(skillData), []);

  // --- Combat and Game Logic ---
  const log = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev.slice(-19), { message: `[${timestamp}] ${message}`, type }]);
  }, []);

  const gainXP = useCallback((amount) => {
    setPlayerStats(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;
      let newStrength = prev.strength;
      let newIntelligence = prev.intelligence;
      let newDefense = prev.defense;

      if (newXp >= newXpToNextLevel) {
        newLevel += 1;
        newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
        newStrength += getRandomNumber(1, 2);
        newIntelligence += getRandomNumber(1, 2);
        newDefense += getRandomNumber(0, 1);
        log(`You leveled up! You are now level ${newLevel}. Your stats have increased!`, 'success');
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpToNextLevel,
        strength: newStrength,
        intelligence: newIntelligence,
        defense: newDefense,
      };
    });
  }, [log]);

  const resetGame = useCallback(() => {
    setPlayerStats({
      health: 100, maxHealth: 100,
      mana: 100, maxMana: 100,
      level: 1, xp: 0, xpToNextLevel: 100,
      strength: 10, intelligence: 10, defense: 5
    });
    setEnemyStats({ health: 150, maxHealth: 150, level: 1, attack: 10, defense: 5 });
    setCooldowns({});
    setLogMessages([]);
    setInventory([]);
    log('Game has been reset. A new enemy appears!', 'info');
  }, [log]);

  const applySkillEffect = useCallback((skillId) => {
    const skill = skillData[skillId];
    if (!skill) return;

    if (playerStats.mana < skill.manaCost) {
      log('Not enough mana to cast that spell.', 'error');
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      mana: Math.max(0, prev.mana - skill.manaCost),
    }));

    if (skill.damage > 0) {
      const damageMultiplier = (playerStats.intelligence / 10) * (playerStats.strength / 10);
      const finalDamage = Math.max(1, Math.floor(skill.damage * damageMultiplier));
      setEnemyStats(prev => {
        const newHealth = Math.max(0, prev.health - finalDamage);
        if (newHealth === 0) {
          log('The enemy has been defeated!', 'success');
          gainXP(enemyStats.level * 25);
          // Chance to drop an item
          if (Math.random() > 0.5) {
            const items = Object.values(itemData);
            const droppedItem = items[Math.floor(Math.random() * items.length)];
            setInventory(currentInventory => [...currentInventory, droppedItem]);
            log(`The enemy dropped a ${droppedItem.name}!`, 'item');
          }
          setTimeout(resetGame, 3000);
        } else {
          log(`${skill.name} hits the enemy for ${finalDamage} damage!`, 'damage');
        }
        return { ...prev, health: newHealth };
      });
    } else if (skill.damage < 0) {
      const healingMultiplier = playerStats.intelligence / 10;
      const finalHealing = Math.floor(Math.abs(skill.damage) * healingMultiplier);
      setPlayerStats(prev => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + finalHealing),
      }));
      log(`${skill.name} heals you for ${finalHealing} health.`, 'healing');
    } else {
      log(`${skill.name} activated.`, 'utility');
    }

  }, [playerStats, enemyStats, log, gainXP, resetGame]);

  const handleItemUse = useCallback((item) => {
    log(`You used a ${item.name}.`, 'item');
    setPlayerStats(prev => ({
      ...prev,
      health: Math.min(prev.maxHealth, prev.health + (item.effect.health || 0)),
      mana: Math.min(prev.maxMana, prev.mana + (item.effect.mana || 0)),
      intelligence: prev.intelligence + (item.effect.intelligence || 0),
    }));
    setInventory(prev => prev.filter(invItem => invItem.id !== item.id));
  }, [log]);

  // Handle skill activation
  const activateSkill = useCallback((skillId) => {
    if (cooldowns[skillId] && cooldowns[skillId] > new Date().getTime()) {
      log('Skill is on cooldown.', 'warning');
      return;
    }
    const skill = skillData[skillId];
    if (playerStats.mana < skill.manaCost) {
      log('Not enough mana to cast that spell.', 'error');
      return;
    }

    setIsAnimating(true);
    setActiveSkillId(skillId);
    applySkillEffect(skillId);

    const newCooldownTime = new Date().getTime() + skill.cooldown * 1000;
    setCooldowns(prev => ({ ...prev, [skillId]: newCooldownTime }));
  }, [cooldowns, applySkillEffect, log, playerStats.mana]);

  // --- Drag and Drop Logic ---
  const handleDragStart = (e, skill) => {
    e.dataTransfer.setData('skillId', skill.id);
    setDraggedSkill(skill);
    setIsTooltipVisible(true);
    setHoveredData({ data: skill, type: 'skill' });
    // This is for visual feedback.
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedSkill(null);
    setIsTooltipVisible(false);
    setHoveredData(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const skillId = e.dataTransfer.getData('skillId');
    activateSkill(parseInt(skillId, 10));
    setDraggedSkill(null);
    setIsTooltipVisible(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggedSkill) {
      const dropZoneRect = dropZoneRef.current.getBoundingClientRect();
      const isOverDropZone = e.clientX >= dropZoneRect.left && e.clientX <= dropZoneRect.right &&
                           e.clientY >= dropZoneRect.top && e.clientY <= dropZoneRect.bottom;
      if (isOverDropZone) {
        e.dataTransfer.dropEffect = 'move';
        setIsTooltipVisible(true);
      } else {
        e.dataTransfer.dropEffect = 'none';
        setIsTooltipVisible(false);
      }
    }
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };
  
  // --- Game Loop / AI ---
  // Simple enemy AI that attacks the player.
  useEffect(() => {
    const enemyAttack = setInterval(() => {
      setPlayerStats(prev => {
        if (enemyStats.health <= 0 || prev.health <= 0) {
          clearInterval(enemyAttack);
          return prev;
        }
        const damageTaken = Math.max(1, enemyStats.attack - prev.defense);
        log(`Enemy attacks for ${damageTaken} damage!`, 'enemy-damage');
        return { ...prev, health: Math.max(0, prev.health - damageTaken) };
      });
    }, 4000); // Enemy attacks every 4 seconds.

    return () => clearInterval(enemyAttack);
  }, [log, enemyStats.health, enemyStats.attack, playerStats.defense]);

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
      setTimeout(resetGame, 5000);
    }
  }, [playerStats.health, log, resetGame]);

  // --- Rendering Logic ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-inter relative">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.8); }
          100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
        }
        .animate-pulse { animation: pulse 1s infinite; }
      `}</style>

      <div className="absolute top-4 right-4 z-50">
        <button
          className="p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors duration-200"
          onClick={() => setIsMuted(prev => !prev)}
        >
          {isMuted ? <BiVolumeMute size={24} /> : <BiVolumeFull size={24} />}
        </button>
      </div>

      {/* Skill Activation Display */}
      {isAnimating && activeSkillId && (
        <SkillAnimation
          skill={skillData[activeSkillId]}
          isAnimating={isAnimating}
          onComplete={() => setIsAnimating(false)}
        />
      )}

      {/* Tooltip for skill details */}
      {isTooltipVisible && <Tooltip data={hoveredData.data} position={tooltipPosition} type={hoveredData.type} />}

      {/* Main Game UI Container */}
      <div className="w-full max-w-6xl p-6 bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
          Skill Activation Simulator
        </h1>
        <p className="text-center text-sm text-gray-400 mb-4">Drag a skill to the drop zone to activate it.</p>

        {/* Player and Enemy Combatants */}
        <div className="w-full flex justify-around items-end h-64 relative">
          {/* Player Character */}
          <div className="flex flex-col items-center text-center">
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
          <div className="flex flex-col items-center text-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 mb-2">
              <path d="M50 10 L80 90 L20 90 Z" fill="#ff4d4d" stroke="#333" strokeWidth="2" />
              <text x="50" y="65" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#fff">E</text>
            </svg>
            <span className="font-bold">Level {enemyStats.level}</span>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="w-full flex justify-between items-start gap-6">
          <PlayerStats stats={playerStats} />
          <EnemyStats stats={enemyStats} />
        </div>

        {/* Action Log */}
        <GameLog messages={logMessages} />
        
        {/* Inventory */}
        <Inventory items={inventory} onUse={handleItemUse} />

        {/* Skill Drag & Drop Zone */}
        <div
          id="drop-zone"
          ref={dropZoneRef}
          className="w-full h-40 border-4 border-dashed border-gray-500 rounded-xl flex items-center justify-center text-center text-gray-500 font-bold text-lg transition-all duration-300"
          style={{
            borderColor: draggedSkill ? 'white' : 'transparent',
            backgroundColor: draggedSkill ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            boxShadow: draggedSkill ? '0 0 15px rgba(255, 255, 255, 0.5)' : 'none',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseOver={() => {
            if (draggedSkill) {
              setTooltipPosition({ x: window.event.clientX, y: window.event.clientY });
              setIsTooltipVisible(true);
            }
          }}
          onMouseLeave={() => {
            if (draggedSkill) {
              setIsTooltipVisible(false);
            }
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

            return (
              <div
                key={id}
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center border-2 border-gray-600 shadow-xl transition-all duration-200 ${cooldownStyle}`}
                style={{ backgroundColor: color }}
                draggable={!onCooldown}
                onDragStart={(e) => handleDragStart(e, skill)}
                onDragEnd={handleDragEnd}
                onClick={() => !onCooldown && activateSkill(id)}
                onMouseEnter={(e) => {
                  setHoveredData({ data: skill, type: 'skill' });
                  setIsTooltipVisible(true);
                  setTooltipPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                  setHoveredData(null);
                  setIsTooltipVisible(false);
                }}
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillActivation;
