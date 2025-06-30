import React from 'react';

interface Mascot3DProps {
  mood?: 'happy' | 'thinking' | 'encouraging' | 'celebrating' | 'listening';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  message?: string;
}

const EvolveMascot3D: React.FC<Mascot3DProps> = ({ 
  mood = 'happy', 
  size = 'medium', 
  animated = true,
  message 
}) => {
  const sizeClasses = {
    small: 'w-16 h-20',
    medium: 'w-24 h-28',
    large: 'w-32 h-36'
  };

  const colors = {
    happy: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#93C5FD' },
    thinking: { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#C4B5FD' },
    encouraging: { primary: '#10B981', secondary: '#34D399', accent: '#6EE7B7' },
    celebrating: { primary: '#F59E0B', secondary: '#FBBF24', accent: '#FCD34D' },
    listening: { primary: '#06B6D4', secondary: '#22D3EE', accent: '#67E8F9' }
  };

  const getMouthExpression = () => {
    switch (mood) {
      case 'happy':
        return 'M 8 12 Q 12 16 16 12';
      case 'thinking':
        return 'M 10 14 Q 12 13 14 14';
      case 'encouraging':
        return 'M 6 12 Q 12 18 18 12';
      case 'celebrating':
        return 'M 6 10 Q 12 20 18 10';
      case 'listening':
        return 'M 10 13 Q 12 15 14 13';
      default:
        return 'M 8 12 Q 12 16 16 12';
    }
  };

  const getAnimationClass = () => {
    if (!animated) return '';
    
    switch (mood) {
      case 'happy':
        return 'animate-bounce';
      case 'thinking':
        return 'animate-pulse';
      case 'encouraging':
        return 'animate-bounce';
      case 'celebrating':
        return 'animate-bounce';
      case 'listening':
        return 'animate-pulse';
      default:
        return 'animate-pulse';
    }
  };

  const currentColor = colors[mood];

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Mascotte 3D - Version simplifiée avec animations conditionnelles */}
      <div className="relative">
        <div className={`${sizeClasses[size]} relative ${getAnimationClass()}`}>
          {/* Corps principal */}
          <div 
            className="absolute inset-0 rounded-full shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${currentColor.primary} 0%, ${currentColor.secondary} 50%, ${currentColor.accent} 100%)`,
              boxShadow: `0 8px 32px ${currentColor.primary}40`
            }}
          >
            {/* Reflet sur le corps */}
            <div 
              className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full opacity-30"
              style={{ background: 'linear-gradient(135deg, white 0%, transparent 70%)' }}
            />
          </div>

          {/* Visage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Yeux */}
            <div className="flex space-x-2 mb-1">
              <div className="w-2 h-2 bg-white rounded-full shadow-inner relative overflow-hidden">
                <div className="absolute w-1 h-1 bg-gray-800 rounded-full top-0.5 left-0.5" />
              </div>
              <div className="w-2 h-2 bg-white rounded-full shadow-inner relative overflow-hidden">
                <div className="absolute w-1 h-1 bg-gray-800 rounded-full top-0.5 left-0.5" />
              </div>
            </div>

            {/* Bouche */}
            <svg width="24" height="24" className="overflow-visible">
              <path
                d={getMouthExpression()}
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Ombre portée */}
        <div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(ellipse, ${currentColor.primary} 0%, transparent 70%)`,
            filter: 'blur(2px)'
          }}
        />
      </div>

      {/* Message de la mascotte */}
      {message && (
        <div className="relative max-w-xs">
          <div 
            className="rounded-2xl p-4 shadow-lg border relative"
            style={{
              background: `linear-gradient(135deg, ${currentColor.accent}20 0%, white 50%)`,
              borderColor: `${currentColor.accent}40`
            }}
          >
            <p className="text-sm text-gray-700 text-center font-medium leading-relaxed">
              {message}
            </p>
            {/* Bulle de dialogue */}
            <div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
              style={{ 
                background: `linear-gradient(135deg, ${currentColor.accent}20 0%, white 50%)`,
                borderLeft: `1px solid ${currentColor.accent}40`,
                borderTop: `1px solid ${currentColor.accent}40`
              }}
            />
          </div>
        </div>
      )}

      {/* Nom de la mascotte */}
      <div className="text-center">
        <p 
          className="text-xs font-bold tracking-wider"
          style={{ color: currentColor.primary }}
        >
          EVOLVE
        </p>
        <div 
          className="w-8 h-0.5 mx-auto mt-1 rounded-full"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${currentColor.secondary}, transparent)`
          }}
        />
      </div>
    </div>
  );
};

export default EvolveMascot3D;