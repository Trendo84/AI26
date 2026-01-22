import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Grid3x3, Settings, X, ChevronRight, ChevronDown, ChevronUp, Check, Trash2, Edit3, Image, Calendar, Moon, Sun, Zap, Clock, RotateCcw, Sparkles, Upload } from 'lucide-react';

// Theme definitions
const themes = {
  sepia: {
    name: 'Sepia',
    background: 'linear-gradient(135deg, #F5EBE0 0%, #EDE4D3 50%, #E5D9C9 100%)',
    cardBg: '#FAF7F0',
    text: '#3D3226',
    textSecondary: '#6B5D4D',
    accent: '#C4A77D',
    accentLight: 'rgba(196, 167, 125, 0.2)',
    glassBg: 'rgba(245, 235, 220, 0.7)',
    glassBorder: 'rgba(139, 115, 85, 0.2)',
    grain: true,
  },
  modern: {
    name: 'Modern',
    background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 50%, #EEEEEE 100%)',
    cardBg: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    accent: '#0066CC',
    accentLight: 'rgba(0, 102, 204, 0.15)',
    glassBg: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(0, 0, 0, 0.1)',
    grain: false,
  },
  dark: {
    name: 'Dark',
    background: 'linear-gradient(135deg, #0A0A0A 0%, #141414 50%, #1A1A1A 100%)',
    cardBg: '#1E1E1E',
    text: '#F5F5F5',
    textSecondary: '#999999',
    accent: '#E8E8E8',
    accentLight: 'rgba(232, 232, 232, 0.1)',
    glassBg: 'rgba(30, 30, 30, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    grain: false,
  },
  cyberpunk: {
    name: 'Cyberpunk',
    background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A0D 50%, #0D0D0D 100%)',
    cardBg: '#151515',
    text: '#F3E600',
    textSecondary: '#B8AD00',
    accent: '#FF0055',
    accentLight: 'rgba(243, 230, 0, 0.15)',
    glassBg: 'rgba(13, 13, 13, 0.85)',
    glassBorder: 'rgba(243, 230, 0, 0.3)',
    grain: true,
    glow: true,
  },
};

// Demo memories with Unsplash images
const generateDemoMemories = () => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop', note: 'Mountain sunrise' },
    { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop', note: 'Found this hidden trail' },
    { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop', note: 'Foggy morning walk' },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop', note: 'Forest bathing' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop', note: '' },
    { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop', note: 'Perfect sunset' },
    { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop', note: 'Deep in nature' },
    { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=600&fit=crop', note: 'Waterfall discovery' },
    { url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&h=600&fit=crop', note: 'River reflections' },
    { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=600&fit=crop', note: 'Golden hour magic' },
    { url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=600&h=600&fit=crop', note: 'Beach day' },
    { url: 'https://images.unsplash.com/photo-1518173946687-a4c036bc4add?w=600&h=600&fit=crop', note: '' },
    { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop', note: 'Summit reached!' },
    { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=600&fit=crop', note: 'Peaceful moment' },
    { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop', note: 'Starry night' },
  ];

  const memories = [];
  const today = new Date();
  const daysBack = [0, 3, 7, 14, 21, 35, 60, 90, 120, 180, 220, 280, 320, 365, 400];
  
  daysBack.forEach((days, index) => {
    if (index < images.length) {
      const date = new Date(today);
      date.setDate(date.getDate() - days);
      const dateStr = date.toISOString().split('T')[0];
      memories.push({
        id: `demo-${index}`,
        uri: images[index].url,
        date: dateStr,
        timestamp: date.getTime(),
        note: images[index].note,
        createdAt: date.getTime(),
      });
    }
  });
  
  return memories;
};

// Animated Splash Screen Component
const SplashScreen = ({ theme, onComplete }) => {
  const [phase, setPhase] = useState(0);
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 400),
      setTimeout(() => setPhase(3), 600),
      setTimeout(() => setPhase(4), 1200),
      setTimeout(() => setPhase(5), 1600),
      setTimeout(() => setPhase(6), 2200),
      setTimeout(() => setPhase(7), 2800),
      setTimeout(() => setPhase(8), 3400),
      setTimeout(() => onComplete(), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: t.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      opacity: phase >= 8 ? 0 : 1,
      transition: 'opacity 400ms ease-out',
    }}>
      {/* Film grain overlay */}
      {t.grain && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: phase >= 1 ? 0.06 : 0,
          transition: 'opacity 500ms ease-in',
          pointerEvents: 'none',
        }} />
      )}

      {/* Light leaks */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-20%',
        width: '80%',
        height: '80%',
        background: isCyberpunk 
          ? 'radial-gradient(ellipse at center, rgba(243,230,0,0.15) 0%, transparent 70%)'
          : 'radial-gradient(ellipse at center, rgba(255,200,150,0.15) 0%, transparent 70%)',
        opacity: phase >= 1 && phase < 5 ? 1 : 0,
        transition: 'opacity 800ms ease',
      }} />

      {/* Ripple effect */}
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        border: `2px solid ${t.accent}`,
        opacity: phase >= 2 && phase < 5 ? 0.3 : 0,
        transform: phase >= 2 ? 'scale(3)' : 'scale(0)',
        transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.2s ease',
      }} />
      <div style={{
        position: 'absolute',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: `1px solid ${t.accent}`,
        opacity: phase >= 2 && phase < 5 ? 0.2 : 0,
        transform: phase >= 2 ? 'scale(2.5)' : 'scale(0)',
        transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 100ms, opacity 1s ease 100ms',
      }} />

      {/* Title */}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '52px',
        fontWeight: 700,
        color: t.text,
        margin: 0,
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? 'scale(1)' : 'scale(0.8)',
        filter: phase >= 3 ? 'blur(0px)' : 'blur(20px)',
        transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        textShadow: isCyberpunk ? `0 0 20px ${t.text}, 0 0 40px ${t.text}` : 'none',
        position: 'relative',
        zIndex: 2,
      }}>
        Momento
      </h1>

      {/* Tagline */}
      <p style={{
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontSize: '16px',
        fontStyle: 'italic',
        color: t.textSecondary,
        margin: '12px 0 0 0',
        opacity: phase >= 4 ? 1 : 0,
        filter: phase >= 4 ? 'blur(0px)' : 'blur(15px)',
        transition: 'all 600ms ease',
        position: 'relative',
        zIndex: 2,
      }}>
        One day, one moment
      </p>

      {/* Polaroid frames */}
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '15%',
        width: '100px',
        height: '120px',
        background: t.cardBg,
        borderRadius: '4px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        transform: phase >= 5 ? 'rotate(8deg) scale(1.1)' : 'rotate(8deg) scale(0.6)',
        opacity: phase >= 5 && phase < 7 ? 0.6 : 0,
        transition: 'all 600ms ease',
      }} />
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '12%',
        width: '80px',
        height: '100px',
        background: t.cardBg,
        borderRadius: '4px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        transform: phase >= 5 ? 'rotate(-5deg) scale(1.1)' : 'rotate(-5deg) scale(0.6)',
        opacity: phase >= 5 && phase < 7 ? 0.5 : 0,
        transition: 'all 600ms ease 50ms',
      }} />

      {/* Glass overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        opacity: phase >= 6 ? 1 : 0,
        transition: 'opacity 400ms ease',
      }} />

      {/* Wave transition */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: phase >= 7 ? '100%' : '0%',
        background: t.background,
        transition: 'height 600ms cubic-bezier(0.65, 0, 0.35, 1)',
      }} />
    </div>
  );
};

// Rotating Light Ring Capture Button Component
const CaptureButton = ({ onPress, size = 56, theme, hasCapturedToday, streakDays }) => {
  const [isPressed, setIsPressed] = useState(false);
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';
  const ringSize = size + 16;
  
  // Streak progress calculation
  const streakProgress = Math.min(streakDays / 7, 1);
  const circumference = 2 * Math.PI * ((ringSize / 2) - 4);
  const strokeDashoffset = circumference * (1 - streakProgress);

  // Get gradient colors based on theme
  const getGradientColors = () => {
    if (isCyberpunk) {
      return {
        start: 'rgba(243, 230, 0, 0.9)',
        mid: 'rgba(255, 0, 85, 0.3)',
        end: 'rgba(243, 230, 0, 0.9)',
      };
    }
    if (theme === 'sepia') {
      return {
        start: 'rgba(196, 167, 125, 0.9)',
        mid: 'rgba(196, 167, 125, 0.2)',
        end: 'rgba(196, 167, 125, 0.9)',
      };
    }
    if (theme === 'dark') {
      return {
        start: 'rgba(255, 255, 255, 0.9)',
        mid: 'rgba(255, 255, 255, 0.2)',
        end: 'rgba(255, 255, 255, 0.9)',
      };
    }
    return {
      start: 'rgba(0, 102, 204, 0.9)',
      mid: 'rgba(0, 102, 204, 0.2)',
      end: 'rgba(0, 102, 204, 0.9)',
    };
  };

  const colors = getGradientColors();

  return (
    <button
      onClick={onPress}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        position: 'relative',
        width: ringSize,
        height: ringSize,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isPressed ? 'scale(0.9)' : 'scale(1)',
        transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Rotating Light Ring */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          animation: hasCapturedToday ? 'none' : 'rotateRing 3s linear infinite',
        }}
      >
        <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
          <defs>
            <linearGradient id={`captureGrad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="50%" stopColor={colors.mid} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
            {isCyberpunk && (
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            )}
          </defs>
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={(ringSize / 2) - 4}
            fill="none"
            stroke={`url(#captureGrad-${theme})`}
            strokeWidth="3"
            strokeLinecap="round"
            filter={isCyberpunk ? 'url(#glow)' : 'none'}
            style={{
              opacity: hasCapturedToday ? 0.3 : 1,
            }}
          />
        </svg>
      </div>

      {/* Streak Progress Ring (underneath) */}
      {streakDays > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
        }}>
          <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
            {/* Background track */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={(ringSize / 2) - 4}
              fill="none"
              stroke={t.accentLight}
              strokeWidth="3"
              opacity="0.3"
            />
            {/* Progress arc */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={(ringSize / 2) - 4}
              fill="none"
              stroke={isCyberpunk ? t.accent : t.accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
              style={{
                filter: isCyberpunk ? `drop-shadow(0 0 4px ${t.accent})` : 'none',
                transition: 'stroke-dashoffset 500ms ease',
              }}
            />
          </svg>
        </div>
      )}

      {/* Outer Glass Button */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          background: hasCapturedToday 
            ? 'rgba(128, 128, 128, 0.3)' 
            : isCyberpunk 
              ? 'rgba(243, 230, 0, 0.2)' 
              : 'rgba(255, 255, 255, 0.3)',
          border: `1px solid ${hasCapturedToday ? 'rgba(128, 128, 128, 0.3)' : 'rgba(255, 255, 255, 0.5)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: hasCapturedToday 
            ? 'none' 
            : isCyberpunk 
              ? `0 0 20px ${t.text}44, inset 0 0 20px ${t.text}22`
              : '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        {/* Inner White Circle */}
        <div
          style={{
            width: size - 12,
            height: size - 12,
            borderRadius: (size - 12) / 2,
            background: hasCapturedToday 
              ? t.textSecondary 
              : isCyberpunk 
                ? `linear-gradient(135deg, ${t.text} 0%, ${t.accent} 100%)`
                : theme === 'sepia'
                  ? `linear-gradient(135deg, ${t.accent} 0%, #A08060 100%)`
                  : theme === 'dark'
                    ? 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)'
                    : `linear-gradient(135deg, ${t.accent} 0%, #0055AA 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hasCapturedToday 
              ? 'none' 
              : isCyberpunk
                ? `0 0 12px ${t.text}66`
                : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <Camera 
            size={size * 0.35} 
            color={hasCapturedToday ? '#888' : (isCyberpunk || theme === 'sepia' ? '#0D0D0D' : '#FFFFFF')} 
            strokeWidth={2.5}
          />
        </div>
      </div>

      <style>{`
        @keyframes rotateRing {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
};

// Glass Navigation Bar Component
const GlassNavBar = ({ activeTab, onTabChange, hasCapturedToday, streakDays, theme }) => {
  const t = themes[theme];
  const [pressedButton, setPressedButton] = useState(null);
  const isCyberpunk = theme === 'cyberpunk';

  const handlePress = (tab) => {
    setPressedButton(tab);
    setTimeout(() => setPressedButton(null), 150);
    onTabChange(tab);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '20px',
      right: '20px',
      height: '80px',
      borderRadius: '32px',
      background: t.glassBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${t.glassBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      zIndex: 100,
    }}>
      {/* Timeline button */}
      <button
        onClick={() => handlePress('timeline')}
        style={{
          background: 'none',
          border: 'none',
          padding: '12px',
          cursor: 'pointer',
          transform: pressedButton === 'timeline' ? 'scale(0.9)' : activeTab === 'timeline' ? 'scale(1)' : 'scale(0.9)',
          opacity: activeTab === 'timeline' ? 1 : 0.5,
          transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Grid3x3 size={24} color={t.text} />
      </button>

      {/* Capture button with rotating light ring */}
      <CaptureButton
        onPress={() => handlePress('capture')}
        size={56}
        theme={theme}
        hasCapturedToday={hasCapturedToday}
        streakDays={streakDays}
      />

      {/* Settings button */}
      <button
        onClick={() => handlePress('settings')}
        style={{
          background: 'none',
          border: 'none',
          padding: '12px',
          cursor: 'pointer',
          transform: pressedButton === 'settings' ? 'scale(0.9)' : activeTab === 'settings' ? 'scale(1)' : 'scale(0.9)',
          opacity: activeTab === 'settings' ? 1 : 0.5,
          transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Settings size={24} color={t.text} />
      </button>
    </div>
  );
};

// Horizontal Calendar Strip Component
const CalendarStrip = ({ memories, theme, onDayClick, selectedDate, onMonthChange }) => {
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';
  const scrollRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'short' }).toUpperCase();
  
  const memoryDates = new Set(memories.map(m => m.date));

  // Generate days for current month
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      day: i,
      dateStr,
      dayName: date.toLocaleString('default', { weekday: 'short' }).charAt(0),
      hasMemory: memoryDates.has(dateStr),
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDate,
    });
  }

  // Scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const todayIndex = today.getDate() - 1;
      const scrollPosition = Math.max(0, todayIndex * 52 - 100);
      scrollRef.current.scrollLeft = scrollPosition;
    }
  }, [currentMonth]);

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };

  return (
    <div style={{
      margin: '0 0 16px',
      padding: '12px 0',
    }}>
      {/* Month navigation header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '12px',
        padding: '0 16px',
      }}>
        <button
          onClick={() => navigateMonth(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            opacity: 0.6,
            transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.6}
        >
          <ChevronDown size={18} color={t.text} style={{ transform: 'rotate(90deg)' }} />
        </button>
        
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '13px',
          fontWeight: 600,
          color: t.text,
          letterSpacing: '2px',
          minWidth: '100px',
          textAlign: 'center',
        }}>
          {monthName} {currentYear}
        </span>
        
        <button
          onClick={() => navigateMonth(1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            opacity: 0.6,
            transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.6}
        >
          <ChevronDown size={18} color={t.text} style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </div>

      {/* Horizontal scrolling day strip */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '8px 16px',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {days.map((d) => (
          <button
            key={d.dateStr}
            onClick={() => d.hasMemory && onDayClick(d.dateStr)}
            style={{
              flexShrink: 0,
              width: '44px',
              height: '56px',
              borderRadius: '12px',
              border: d.isToday 
                ? `2px solid ${isCyberpunk ? t.text : t.accent}` 
                : d.isSelected
                  ? `1px solid ${t.glassBorder}`
                  : '1px solid transparent',
              background: d.isSelected 
                ? t.accentLight 
                : d.isToday 
                  ? `${isCyberpunk ? t.text : t.accent}15`
                  : 'transparent',
              cursor: d.hasMemory ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              position: 'relative',
              transition: 'all 150ms ease',
              boxShadow: d.isToday && isCyberpunk ? `0 0 12px ${t.text}33` : 'none',
            }}
          >
            {/* Day name (M, T, W, etc) */}
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              color: t.textSecondary,
              textTransform: 'uppercase',
            }}>
              {d.dayName}
            </span>
            
            {/* Day number */}
            <span style={{
              fontSize: '16px',
              fontWeight: d.isToday || d.isSelected ? 700 : 500,
              color: d.isToday 
                ? (isCyberpunk ? t.text : t.accent)
                : d.isSelected 
                  ? t.text 
                  : t.text,
            }}>
              {d.day}
            </span>

            {/* Memory dot indicator */}
            {d.hasMemory && (
              <div style={{
                position: 'absolute',
                bottom: '6px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: isCyberpunk ? t.text : t.accent,
                animation: 'pulseDot 2s ease-in-out infinite',
                boxShadow: isCyberpunk 
                  ? `0 0 8px ${t.text}`
                  : `0 0 6px ${t.accent}`,
              }} />
            )}
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes pulseDot {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(0.85);
          }
        }
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// Polaroid Card Component
const PolaroidCard = ({ memory, theme, onClick, onLongPress, onUpdateNote, index }) => {
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(memory.note || '');
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef(null);

  const memoryDate = new Date(memory.date);
  const daysSince = Math.floor((Date.now() - memoryDate.getTime()) / (1000 * 60 * 60 * 24));
  const ageFactor = daysSince > 30 ? Math.min((daysSince - 30) / 1065, 1) : 0;
  const opacity = 1 - (ageFactor * 0.3);

  const dayName = memoryDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = memoryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const handleMouseDown = () => {
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      setIsEditing(true);
    }, 500);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      if (!isEditing) {
        onClick();
      }
    }
  };

  const handleSaveNote = () => {
    onUpdateNote(memory.id, note);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        background: t.cardBg,
        borderRadius: '4px',
        padding: '8px',
        paddingBottom: '48px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        margin: '0 16px 24px',
        cursor: 'pointer',
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: `fadeInUp 500ms ease ${index * 50}ms both`,
        border: `1px solid ${theme === 'dark' || isCyberpunk ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsPressed(false);
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
      }}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <img
          src={memory.uri}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: opacity,
            filter: theme === 'sepia' && daysSince > 30 ? `sepia(${ageFactor * 0.3})` : 'none',
            transition: 'opacity 400ms ease, filter 400ms ease',
          }}
        />
        
        {/* Film grain overlay */}
        {t.grain && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: theme === 'sepia' ? 0.04 : 0.02,
            pointerEvents: 'none',
          }} />
        )}

        {/* Vignette gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.15) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Glass date overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 14px',
          background: theme === 'dark' || isCyberpunk 
            ? 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))'
            : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.8))',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: `1px solid ${isCyberpunk ? `${t.text}33` : 'rgba(255,255,255,0.2)'}`,
          boxShadow: isCyberpunk ? `0 -4px 12px ${t.text}33` : 'none',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: theme === 'dark' || isCyberpunk ? '#fff' : t.text,
            textShadow: isCyberpunk ? `0 0 8px ${t.text}` : 'none',
          }}>
            {dayName}
          </div>
          <div style={{
            fontSize: '12px',
            color: theme === 'dark' || isCyberpunk ? 'rgba(255,255,255,0.8)' : t.textSecondary,
          }}>
            {dateStr}
          </div>
        </div>
      </div>

      {/* Caption area */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        right: '8px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {isEditing ? (
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 150))}
            onBlur={handleSaveNote}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
            autoFocus
            placeholder="Add a caption..."
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: t.accentLight,
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '13px',
              color: t.text,
              textAlign: 'center',
              outline: 'none',
            }}
          />
        ) : (
          <span style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontStyle: 'italic',
            fontSize: '13px',
            color: memory.note ? t.text : t.textSecondary,
            opacity: memory.note ? 1 : 0.5,
            textAlign: 'center',
          }}>
            {memory.note || 'Hold to add caption...'}
          </span>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Year Sidebar Component
const YearSidebar = ({ memories, theme, isOpen, onClose, onYearMonthClick, position }) => {
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';
  const [expandedYear, setExpandedYear] = useState(new Date().getFullYear().toString());

  const yearGroups = memories.reduce((acc, memory) => {
    const year = new Date(memory.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(memory);
    return acc;
  }, {});

  const years = Object.keys(yearGroups).sort((a, b) => b - a);

  const getMonthsForYear = (year) => {
    const monthsMap = {};
    yearGroups[year].forEach(memory => {
      const date = new Date(memory.date);
      const monthKey = date.getMonth();
      const monthName = date.toLocaleString('default', { month: 'short' });
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { name: monthName, count: 0, monthIndex: monthKey };
      }
      monthsMap[monthKey].count++;
    });
    return Object.values(monthsMap).sort((a, b) => b.monthIndex - a.monthIndex);
  };

  const handleMonthClick = (year, monthIndex) => {
    onYearMonthClick(parseInt(year), monthIndex);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
          zIndex: 200,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />
      
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        [position]: 0,
        bottom: 0,
        width: '200px',
        background: t.glassBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: position === 'right' ? `1px solid ${t.glassBorder}` : 'none',
        borderRight: position === 'left' ? `1px solid ${t.glassBorder}` : 'none',
        transform: isOpen ? 'translateX(0)' : `translateX(${position === 'right' ? '100%' : '-100%'})`,
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '60px 20px 20px',
          borderBottom: `1px solid ${t.glassBorder}`,
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '20px',
            fontWeight: 700,
            color: t.text,
            margin: 0,
            textShadow: isCyberpunk ? `0 0 10px ${t.text}` : 'none',
          }}>
            Your Timeline
          </h3>
          <p style={{
            fontSize: '12px',
            color: t.textSecondary,
            margin: '4px 0 0',
          }}>
            {memories.length} moments captured
          </p>
        </div>

        {/* Years list with smooth scrolling */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
          WebkitOverflowScrolling: 'touch',
        }}>
          {years.map(year => {
            const isExpanded = expandedYear === year;
            const yearMemories = yearGroups[year].length;
            const daysInYear = year === new Date().getFullYear().toString() 
              ? Math.floor((Date.now() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1
              : 365;
            
            return (
              <div key={year} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => setExpandedYear(isExpanded ? null : year)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isExpanded ? t.accentLight : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '22px',
                      fontWeight: 700,
                      color: isCyberpunk ? t.text : t.accent,
                      textShadow: isCyberpunk ? `0 0 6px ${t.text}` : 'none',
                    }}>
                      {year}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: t.textSecondary,
                      marginTop: '2px',
                    }}>
                      {yearMemories}/{daysInYear} days
                    </div>
                  </div>
                  <ChevronDown 
                    size={18} 
                    color={t.textSecondary}
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                    }}
                  />
                </button>

                {/* Months accordion */}
                <div style={{
                  maxHeight: isExpanded ? '500px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 300ms ease',
                }}>
                  <div style={{ padding: '8px 0 8px 12px' }}>
                    {getMonthsForYear(year).map((month) => (
                      <button
                        key={month.name}
                        onClick={() => handleMonthClick(year, month.monthIndex)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '10px 12px',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: t.text,
                          borderRadius: '8px',
                          transition: 'background 150ms ease',
                        }}
                        onMouseEnter={(e) => e.target.style.background = t.accentLight}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <span>{month.name}</span>
                        <span style={{
                          fontSize: '11px',
                          color: t.textSecondary,
                          background: t.accentLight,
                          padding: '2px 8px',
                          borderRadius: '10px',
                        }}>
                          {month.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {years.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: t.textSecondary,
            }}>
              <p style={{ fontSize: '14px', fontStyle: 'italic' }}>
                No memories yet
              </p>
            </div>
          )}
        </div>

        {/* Close hint */}
        <div style={{
          padding: '16px 20px',
          borderTop: `1px solid ${t.glassBorder}`,
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: '11px',
            color: t.textSecondary,
          }}>
            Swipe or tap outside to close
          </span>
        </div>
      </div>
    </>
  );
};

// Photo Viewer Modal
const PhotoViewer = ({ memory, theme, onClose, onDelete, onUpdateNote }) => {
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(memory?.note || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!memory) return null;

  const memoryDate = new Date(memory.date);
  const dayName = memoryDate.toLocaleDateString('en-US', { weekday: 'long' });
  const fullDate = memoryDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handleSave = () => {
    onUpdateNote(memory.id, note);
    setIsEditing(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        animation: 'fadeIn 300ms ease',
        padding: '20px',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={20} color="#fff" />
      </button>

      {/* Photo */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90%',
          maxHeight: '60vh',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <img
          src={memory.uri}
          alt=""
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '60vh',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Info */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 4px',
        }}>
          {dayName}
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.7)',
          margin: '0 0 16px',
        }}>
          {fullDate}
        </p>

        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 150))}
              autoFocus
              placeholder="Add a caption..."
              style={{
                padding: '10px 16px',
                borderRadius: '20px',
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '14px',
                color: '#fff',
                width: '250px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSave}
              style={{
                padding: '10px 16px',
                borderRadius: '20px',
                border: 'none',
                background: isCyberpunk ? t.text : t.accent,
                color: isCyberpunk ? '#000' : '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <p style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontStyle: 'italic',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
          }}>
            {memory.note || 'No caption'}
          </p>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginTop: '24px',
        }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
            }}
          >
            <Edit3 size={16} />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: '1px solid rgba(255,100,100,0.3)',
              background: 'rgba(255,100,100,0.1)',
              color: '#ff6464',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(30,30,30,0.95)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            animation: 'fadeIn 200ms ease',
          }}
        >
          <p style={{ color: '#fff', margin: '0 0 16px' }}>Delete this memory?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(memory.id)}
              style={{
                padding: '10px 24px',
                borderRadius: '20px',
                border: 'none',
                background: '#ff4444',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Capture Screen Component
const CaptureScreen = ({ theme, onCapture, onClose, hasCapturedToday, devMode }) => {
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';
  const fileInputRef = useRef(null);
  const [note, setNote] = useState('');

  if (hasCapturedToday && !devMode) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: t.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: '40px',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: t.glassBg,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} color={t.text} />
        </button>

        <Check size={64} color={isCyberpunk ? t.text : t.accent} style={{
          marginBottom: '24px',
          filter: isCyberpunk ? `drop-shadow(0 0 10px ${t.text})` : 'none',
        }} />
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '28px',
          fontWeight: 700,
          color: t.text,
          margin: '0 0 12px',
          textAlign: 'center',
          textShadow: isCyberpunk ? `0 0 10px ${t.text}` : 'none',
        }}>
          Today's moment captured
        </h2>
        <p style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '16px',
          color: t.textSecondary,
          textAlign: 'center',
        }}>
          Come back tomorrow for a new memory
        </p>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onCapture(e.target.result, note);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: t.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '40px',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          background: t.glassBg,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={20} color={t.text} />
      </button>

      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '32px',
        fontWeight: 700,
        color: t.text,
        margin: '0 0 8px',
        textShadow: isCyberpunk ? `0 0 10px ${t.text}` : 'none',
      }}>
        Capture today's moment
      </h2>
      <p style={{
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontStyle: 'italic',
        fontSize: '14px',
        color: t.textSecondary,
        margin: '0 0 40px',
      }}>
        One day, one moment
      </p>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 150))}
        placeholder="Add a caption (optional)..."
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: '14px 20px',
          borderRadius: '24px',
          border: `1px solid ${t.glassBorder}`,
          background: t.glassBg,
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '14px',
          color: t.text,
          textAlign: 'center',
          outline: 'none',
          marginBottom: '24px',
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: '200px',
          padding: '16px',
          borderRadius: '24px',
          border: 'none',
          background: isCyberpunk ? t.text : t.accent,
          color: isCyberpunk ? '#000' : '#fff',
          fontWeight: 600,
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: `0 4px 20px ${isCyberpunk ? t.text : t.accent}44`,
          transition: 'transform 150ms ease',
        }}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.97)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
      >
        <Upload size={20} />
        Choose Photo
      </button>

      <p style={{
        fontSize: '12px',
        color: t.textSecondary,
        marginTop: '16px',
        opacity: 0.7,
      }}>
        Camera capture available in mobile app
      </p>
    </div>
  );
};

// Settings Screen Component
const SettingsScreen = ({ 
  theme, 
  onThemeChange, 
  sidebarPosition, 
  onSidebarPositionChange,
  demoMode,
  onDemoModeChange,
  devMode,
  onDevModeChange,
  memoriesCount,
  onClose 
}) => {
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';

  const themeOptions = [
    { id: 'sepia', name: 'Sepia', icon: Sun, desc: 'Vintage film look' },
    { id: 'modern', name: 'Modern', icon: Sparkles, desc: 'Clean light theme' },
    { id: 'dark', name: 'Dark', icon: Moon, desc: 'Minimal dark theme' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: Zap, desc: 'Neon sci-fi' },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: t.background,
      zIndex: 300,
      overflowY: 'auto',
      padding: '20px',
      paddingBottom: '120px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '32px',
          fontWeight: 700,
          color: t.text,
          margin: 0,
          textShadow: isCyberpunk ? `0 0 10px ${t.text}` : 'none',
        }}>
          Settings
        </h1>
        <button
          onClick={onClose}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: t.glassBg,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} color={t.text} />
        </button>
      </div>

      {/* Theme Selection */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: 600,
          color: t.textSecondary,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: '0 0 16px',
        }}>
          Theme
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}>
          {themeOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            const optTheme = themes[opt.id];
            return (
              <button
                key={opt.id}
                onClick={() => onThemeChange(opt.id)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: isSelected ? `2px solid ${isCyberpunk ? t.text : t.accent}` : `1px solid ${t.glassBorder}`,
                  background: optTheme.background,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 200ms ease',
                }}
              >
                <Icon size={20} color={optTheme.text} style={{ marginBottom: '8px' }} />
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: optTheme.text,
                }}>
                  {opt.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: optTheme.textSecondary,
                  marginTop: '2px',
                }}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: 600,
          color: t.textSecondary,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: '0 0 16px',
        }}>
          Layout
        </h3>
        <div style={{
          padding: '16px',
          borderRadius: '16px',
          background: t.glassBg,
          border: `1px solid ${t.glassBorder}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ color: t.text, fontSize: '14px' }}>Sidebar Position</span>
            <div style={{
              display: 'flex',
              gap: '8px',
            }}>
              {['left', 'right'].map(pos => (
                <button
                  key={pos}
                  onClick={() => onSidebarPositionChange(pos)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: sidebarPosition === pos ? (isCyberpunk ? t.text : t.accent) : t.accentLight,
                    color: sidebarPosition === pos ? (isCyberpunk ? '#000' : '#fff') : t.text,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '12px',
          fontWeight: 600,
          color: t.textSecondary,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: '0 0 16px',
        }}>
          Options
        </h3>
        <div style={{
          borderRadius: '16px',
          background: t.glassBg,
          border: `1px solid ${t.glassBorder}`,
          overflow: 'hidden',
        }}>
          {/* Demo Mode */}
          <div style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${t.glassBorder}`,
          }}>
            <div>
              <span style={{ color: t.text, fontSize: '14px', display: 'block' }}>Demo Mode</span>
              <span style={{ color: t.textSecondary, fontSize: '12px' }}>Load sample memories</span>
            </div>
            <button
              onClick={() => onDemoModeChange(!demoMode)}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                background: demoMode ? (isCyberpunk ? t.text : t.accent) : t.accentLight,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 200ms ease',
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '11px',
                background: '#fff',
                position: 'absolute',
                top: '3px',
                left: demoMode ? '23px' : '3px',
                transition: 'left 200ms ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>

          {/* Dev Mode */}
          <div style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ color: t.text, fontSize: '14px', display: 'block' }}>Developer Mode</span>
              <span style={{ color: t.textSecondary, fontSize: '12px' }}>Allow retaking today's moment</span>
            </div>
            <button
              onClick={() => onDevModeChange(!devMode)}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                background: devMode ? (isCyberpunk ? t.text : t.accent) : t.accentLight,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 200ms ease',
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '11px',
                background: '#fff',
                position: 'absolute',
                top: '3px',
                left: devMode ? '23px' : '3px',
                transition: 'left 200ms ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: '20px',
        borderRadius: '16px',
        background: t.glassBg,
        border: `1px solid ${t.glassBorder}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '48px',
          fontWeight: 700,
          color: isCyberpunk ? t.text : t.accent,
          textShadow: isCyberpunk ? `0 0 20px ${t.text}` : 'none',
        }}>
          {memoriesCount}
        </div>
        <div style={{
          fontSize: '14px',
          color: t.textSecondary,
          marginTop: '4px',
        }}>
          {memoriesCount === 1 ? 'memory captured' : 'memories captured'}
        </div>
      </div>
    </div>
  );
};

// Year Marker Component
const YearMarker = ({ year, theme }) => {
  const t = themes[theme];
  const isCyberpunk = theme === 'cyberpunk';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      gap: '16px',
      animation: 'fadeIn 500ms ease',
    }}>
      <div style={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${t.glassBorder})`,
      }} />
      <div style={{
        padding: '8px 20px',
        borderRadius: '20px',
        background: t.glassBg,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${t.glassBorder}`,
      }}>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '18px',
          fontWeight: 700,
          color: isCyberpunk ? t.text : t.accent,
          textShadow: isCyberpunk ? `0 0 8px ${t.text}` : 'none',
        }}>
          {year}
        </span>
      </div>
      <div style={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(90deg, ${t.glassBorder}, transparent)`,
      }} />
    </div>
  );
};

// Main App Component
const MomentoApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState('sepia');
  const [activeTab, setActiveTab] = useState('timeline');
  const [memories, setMemories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState('right');
  const [demoMode, setDemoMode] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showCapture, setShowCapture] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);

  const t = themes[theme];
  const today = new Date().toISOString().split('T')[0];
  const hasCapturedToday = memories.some(m => m.date === today);

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const sortedMemories = [...memories].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const checkDate = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedMemories.some(m => m.date === dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i > 0) {
        break;
      } else {
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  // Load demo data
  useEffect(() => {
    if (demoMode) {
      setMemories(generateDemoMemories());
    } else {
      setMemories([]);
    }
  }, [demoMode]);

  const handleTabChange = (tab) => {
    if (tab === 'capture') {
      setShowCapture(true);
    } else if (tab === 'settings') {
      setShowSettings(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleCapture = (uri, note) => {
    const newMemory = {
      id: `memory-${Date.now()}`,
      uri,
      date: today,
      timestamp: Date.now(),
      note: note || '',
      createdAt: Date.now(),
    };
    
    // Remove existing today's memory if dev mode
    if (devMode) {
      setMemories(prev => [...prev.filter(m => m.date !== today), newMemory]);
    } else {
      setMemories(prev => [...prev, newMemory]);
    }
    setShowCapture(false);
  };

  const handleUpdateNote = (id, note) => {
    setMemories(prev => prev.map(m => 
      m.id === id ? { ...m, note } : m
    ));
    if (selectedMemory?.id === id) {
      setSelectedMemory({ ...selectedMemory, note });
    }
  };

  const handleDelete = (id) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    setSelectedMemory(null);
  };

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    const memory = memories.find(m => m.date === dateStr);
    if (memory) {
      setSelectedMemory(memory);
    }
  };

  // Group memories by year for timeline
  const sortedMemories = [...memories].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const memoriesByYear = sortedMemories.reduce((acc, memory) => {
    const year = new Date(memory.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(memory);
    return acc;
  }, {});

  const years = Object.keys(memoriesByYear).sort((a, b) => b - a);

  if (showSplash) {
    return <SplashScreen theme={theme} onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: t.background,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
    }}>
      {/* Film grain overlay */}
      {t.grain && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      {/* Header */}
      <div style={{
        padding: '20px 20px 0',
        position: 'relative',
        zIndex: 2,
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '36px',
          fontWeight: 700,
          color: t.text,
          margin: '0 0 4px',
          textShadow: theme === 'cyberpunk' ? `0 0 10px ${t.text}` : 'none',
        }}>
          Momento
        </h1>
        <p style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '14px',
          color: t.textSecondary,
          margin: '0 0 16px',
        }}>
          One day, one moment
        </p>
        <p style={{
          fontSize: '12px',
          fontWeight: 600,
          color: t.textSecondary,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Horizontal Calendar Strip */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <CalendarStrip 
          memories={memories} 
          theme={theme} 
          selectedDate={selectedDate}
          onDayClick={handleDayClick}
          onMonthChange={(year, month) => {
            // Optional: scroll to first memory of that month
          }}
        />
      </div>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '50%',
          [sidebarPosition]: '0',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '80px',
          borderRadius: sidebarPosition === 'right' ? '8px 0 0 8px' : '0 8px 8px 0',
          border: 'none',
          background: t.glassBg,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        <ChevronRight 
          size={18} 
          color={t.textSecondary}
          style={{ transform: sidebarPosition === 'right' ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {/* Timeline */}
      <div style={{
        padding: '16px 0 120px',
        position: 'relative',
        zIndex: 2,
      }}>
        {years.map((year, yearIndex) => (
          <div key={year}>
            {yearIndex > 0 && <YearMarker year={year} theme={theme} />}
            {memoriesByYear[year].map((memory, index) => (
              <PolaroidCard
                key={memory.id}
                memory={memory}
                theme={theme}
                index={index}
                onClick={() => setSelectedMemory(memory)}
                onLongPress={() => {}}
                onUpdateNote={handleUpdateNote}
              />
            ))}
          </div>
        ))}

        {memories.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            color: t.textSecondary,
          }}>
            <Camera size={48} color={t.textSecondary} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '16px',
            }}>
              No memories yet.<br />Capture your first moment!
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <GlassNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasCapturedToday={hasCapturedToday}
        streakDays={streakDays}
        theme={theme}
      />

      {/* Year Sidebar */}
      <YearSidebar
        memories={memories}
        theme={theme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onYearMonthClick={(year, monthIndex) => {
          // Find first memory of that month and select it
          const monthMemories = memories.filter(m => {
            const d = new Date(m.date);
            return d.getFullYear() === year && d.getMonth() === monthIndex;
          }).sort((a, b) => new Date(a.date) - new Date(b.date));
          
          if (monthMemories.length > 0) {
            setSelectedDate(monthMemories[0].date);
            setSelectedMemory(monthMemories[0]);
          }
        }}
        position={sidebarPosition}
      />

      {/* Photo Viewer */}
      {selectedMemory && (
        <PhotoViewer
          memory={selectedMemory}
          theme={theme}
          onClose={() => setSelectedMemory(null)}
          onDelete={handleDelete}
          onUpdateNote={handleUpdateNote}
        />
      )}

      {/* Capture Screen */}
      {showCapture && (
        <CaptureScreen
          theme={theme}
          onCapture={handleCapture}
          onClose={() => setShowCapture(false)}
          hasCapturedToday={hasCapturedToday}
          devMode={devMode}
        />
      )}

      {/* Settings Screen */}
      {showSettings && (
        <SettingsScreen
          theme={theme}
          onThemeChange={setTheme}
          sidebarPosition={sidebarPosition}
          onSidebarPositionChange={setSidebarPosition}
          demoMode={demoMode}
          onDemoModeChange={setDemoMode}
          devMode={devMode}
          onDevModeChange={setDevMode}
          memoriesCount={memories.length}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
    </div>
  );
};

export default MomentoApp;
