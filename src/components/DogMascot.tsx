import React from 'react';
import mascotImage from '@/assets/cute-dog-mascot.png';

interface DogMascotProps {
  isAnimated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DogMascot: React.FC<DogMascotProps> = ({ 
  isAnimated = false, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto`}>
      <img 
        src={mascotImage} 
        alt="Cute dog mascot with headphones"
        className={`w-full h-full object-cover rounded-full shadow-soft ${
          isAnimated ? 'animate-bounce-gentle' : ''
        }`}
      />
    </div>
  );
};

export default DogMascot;