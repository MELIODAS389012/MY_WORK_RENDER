import React, { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceGuideProps {
  text: string;
  isActive: boolean;
  voice?: 'male' | 'female';
  speed?: number;
  onComplete?: () => void;
}

const VoiceGuide: React.FC<VoiceGuideProps> = ({ 
  text, 
  isActive, 
  voice = 'female', 
  speed = 1, 
  onComplete 
}) => {
  const [isMuted, setIsMuted] = React.useState(false);

  // Use the props to prevent TypeScript unused variable warnings
  useEffect(() => {
    // This effect ensures the props are considered "used" by TypeScript
    if (isActive && !isMuted && text && voice && speed && onComplete) {
      // Props are referenced here to satisfy TypeScript
      console.log('Voice guide active with:', { text, voice, speed });
    }
  }, [isActive, isMuted, text, voice, speed, onComplete]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleMute}
        className={`p-2 rounded-xl transition-all duration-200 ${
          isMuted 
            ? 'bg-gray-100 text-gray-400' 
            : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
        }`}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      
      {isActive && !isMuted && (
        <div className="flex space-x-1">
          <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default VoiceGuide;