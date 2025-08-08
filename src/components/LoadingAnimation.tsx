import React from 'react';
import DogMascot from './DogMascot';

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Listening for barks..." 
}) => {
  return (
    <div className="text-center space-y-6 py-8">
      <DogMascot isAnimated size="lg" />
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          🎧 {message}
        </h3>
        <p className="text-muted-foreground">
          Our AI is carefully analyzing your audio...
        </p>
      </div>

      {/* Cute wagging tail animation */}
      <div className="flex justify-center">
        <div className="w-8 h-8 bg-primary rounded-full animate-wag origin-bottom" />
      </div>

      {/* Bouncing dots */}
      <div className="flex justify-center space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-accent rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;