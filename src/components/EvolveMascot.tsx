import React from 'react';
import EvolveMascot3D from './EvolveMascot3D';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'encouraging' | 'celebrating' | 'listening';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  message?: string;
}

const EvolveMascot: React.FC<MascotProps> = (props) => {
  return <EvolveMascot3D {...props} />;
};

export default EvolveMascot;