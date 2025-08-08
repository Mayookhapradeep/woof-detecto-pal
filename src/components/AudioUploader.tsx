import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-soft">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragActive 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5'
            }
            ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileAudio className="w-8 h-8 text-success" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="h-6 w-6"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-primary" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  🎵 Drop your dog audio here!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Supports MP3, WAV, M4A, OGG files
                </p>
                <Button variant="playful" size="sm" className="mt-2">
                  Choose File 🐕
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioUploader;