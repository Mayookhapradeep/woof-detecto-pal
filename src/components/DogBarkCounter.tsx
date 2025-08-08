import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import DogMascot from './DogMascot';
import AudioUploader from './AudioUploader';
import LoadingAnimation from './LoadingAnimation';
import BarkResults from './BarkResults';
import { AudioProcessor, BarkDetection } from '@/utils/audioProcessor';
import { useToast } from '@/hooks/use-toast';

type AppState = 'idle' | 'processing' | 'results' | 'error';

interface Results {
  barkCount: number;
  detections: BarkDetection[];
  fileName: string;
}

const DogBarkCounter: React.FC = () => {
  const [state, setState] = useState<AppState>('idle');
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string>('');
  const [audioProcessor] = useState(() => new AudioProcessor());
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setState('processing');
    setError('');
    
    try {
      toast({
        title: "🎵 Processing Audio",
        description: "Our AI is analyzing your dog's barks...",
      });

      const result = await audioProcessor.processAudio(file);
      
      setResults({
        ...result,
        fileName: file.name
      });
      
      setState('results');
      
      toast({
        title: "🎉 Analysis Complete!",
        description: `Found ${result.barkCount} bark${result.barkCount !== 1 ? 's' : ''} in your audio!`,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process audio file';
      setError(errorMessage);
      setState('error');
      
      toast({
        title: "❌ Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setState('idle');
    setResults(null);
    setError('');
  };

  const renderContent = () => {
    switch (state) {
      case 'idle':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <DogMascot size="lg" />
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  🐕 Dog Bark Counter
                </h1>
                <p className="text-lg text-muted-foreground">
                  Upload audio and let our AI count those woofs! 🎵
                </p>
              </div>
            </div>
            
            <AudioUploader 
              onFileSelect={handleFileSelect} 
              isProcessing={false}
            />
            
            <Card className="max-w-md mx-auto shadow-soft">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-foreground">
                    ✨ How it works
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>🎤 Upload your dog's audio file</p>
                    <p>🤖 AI analyzes and detects barks</p>
                    <p>📊 Get detailed results with timestamps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'processing':
        return <LoadingAnimation message="Analyzing woofs and barks..." />;

      case 'results':
        return results ? (
          <BarkResults
            barkCount={results.barkCount}
            detections={results.detections}
            audioFileName={results.fileName}
            onReset={handleReset}
          />
        ) : null;

      case 'error':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DogMascot size="lg" />
            </div>
            
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Oops! 🐕</strong><br />
                {error}
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Try again with a different file 🦴
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default DogBarkCounter;