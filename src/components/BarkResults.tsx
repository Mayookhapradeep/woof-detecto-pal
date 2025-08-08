import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Clock, RotateCcw } from 'lucide-react';
import DogMascot from './DogMascot';

interface BarkDetection {
  timestamp: number;
  confidence: number;
}

interface BarkResultsProps {
  barkCount: number;
  detections: BarkDetection[];
  audioFileName: string;
  onReset: () => void;
}

const BarkResults: React.FC<BarkResultsProps> = ({ 
  barkCount, 
  detections, 
  audioFileName, 
  onReset 
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className="shadow-soft gradient-soft">
        <CardHeader className="text-center pb-4">
          <div className="mb-4">
            <DogMascot size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            🎉 Woof! Analysis Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">
              {barkCount} {barkCount === 1 ? 'Bark' : 'Barks'} 🐕
            </div>
            <p className="text-muted-foreground">
              Found in "{audioFileName}"
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button variant="playful" onClick={onReset} className="mt-4">
              <RotateCcw className="w-4 h-4 mr-2" />
              Analyze Another Audio 🦴
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {detections.length > 0 && (
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Bark Timeline 📊</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {detections.map((detection, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      Bark #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">
                      {formatTime(detection.timestamp)}
                    </span>
                    <Badge variant="secondary" className="bg-success/20 text-success-foreground">
                      {Math.round(detection.confidence * 100)}% confident
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fun Stats */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">
                {detections.length > 0 ? 
                  `${(detections[detections.length - 1].timestamp - detections[0].timestamp).toFixed(1)}s` : 
                  '0s'
                }
              </div>
              <p className="text-sm text-muted-foreground">Duration 🕐</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {detections.length > 1 ? 
                  `${((detections[detections.length - 1].timestamp - detections[0].timestamp) / (detections.length - 1)).toFixed(1)}s` : 
                  'N/A'
                }
              </div>
              <p className="text-sm text-muted-foreground">Avg Interval ⏱️</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarkResults;