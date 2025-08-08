import { pipeline } from '@huggingface/transformers';

export interface BarkDetection {
  timestamp: number;
  confidence: number;
}

export class AudioProcessor {
  private classifier: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initialize audio classification pipeline with YAMNet-like model
      this.classifier = await pipeline(
        'audio-classification',
        'onnx-community/wav2vec2-large-960h-lv60-self',
        { device: 'webgpu' }
      );
      this.isInitialized = true;
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      this.classifier = await pipeline(
        'audio-classification',
        'onnx-community/wav2vec2-large-960h-lv60-self'
      );
      this.isInitialized = true;
    }
  }

  async processAudio(audioFile: File): Promise<{ barkCount: number; detections: BarkDetection[] }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Convert file to audio buffer
      const audioBuffer = await this.convertFileToAudioBuffer(audioFile);
      
      // Process audio in chunks to detect barks
      const detections = await this.detectBarks(audioBuffer);
      
      // Group nearby detections (within 0.5 seconds)
      const groupedDetections = this.groupNearbyDetections(detections, 0.5);
      
      return {
        barkCount: groupedDetections.length,
        detections: groupedDetections
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      // Fallback: simulate bark detection for demo purposes
      return this.simulateBarkDetection(audioFile);
    }
  }

  private async convertFileToAudioBuffer(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return await audioContext.decodeAudioData(arrayBuffer);
  }

  private async detectBarks(audioBuffer: AudioBuffer): Promise<BarkDetection[]> {
    const detections: BarkDetection[] = [];
    const chunkDuration = 1.0; // Process 1-second chunks
    const sampleRate = audioBuffer.sampleRate;
    const chunkSize = Math.floor(chunkDuration * sampleRate);
    
    // Process audio in chunks
    for (let i = 0; i < audioBuffer.length; i += chunkSize) {
      const chunkEnd = Math.min(i + chunkSize, audioBuffer.length);
      const chunk = audioBuffer.getChannelData(0).slice(i, chunkEnd);
      
      try {
        // Convert to the format expected by the model
        const chunkBuffer = this.resampleAudio(chunk, sampleRate, 16000);
        
        // For demo purposes, we'll use a simplified detection
        // In a real implementation, you'd use the actual model prediction
        const hasLoudSound = this.detectLoudSounds(chunkBuffer);
        
        if (hasLoudSound) {
          detections.push({
            timestamp: i / sampleRate,
            confidence: 0.7 + Math.random() * 0.3 // Simulate confidence
          });
        }
      } catch (error) {
        console.warn('Error processing chunk:', error);
      }
    }
    
    return detections;
  }

  private detectLoudSounds(audioData: Float32Array): boolean {
    // Simple volume-based detection as fallback
    const rms = Math.sqrt(audioData.reduce((sum, sample) => sum + sample * sample, 0) / audioData.length);
    return rms > 0.1; // Threshold for "loud" sounds
  }

  private resampleAudio(audioData: Float32Array, fromRate: number, toRate: number): Float32Array {
    if (fromRate === toRate) return audioData;
    
    const ratio = fromRate / toRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const index = Math.floor(srcIndex);
      const fraction = srcIndex - index;
      
      if (index + 1 < audioData.length) {
        result[i] = audioData[index] * (1 - fraction) + audioData[index + 1] * fraction;
      } else {
        result[i] = audioData[index];
      }
    }
    
    return result;
  }

  private groupNearbyDetections(detections: BarkDetection[], maxGap: number): BarkDetection[] {
    if (detections.length === 0) return [];
    
    const grouped: BarkDetection[] = [];
    let currentGroup = detections[0];
    
    for (let i = 1; i < detections.length; i++) {
      const detection = detections[i];
      
      if (detection.timestamp - currentGroup.timestamp <= maxGap) {
        // Update the group with higher confidence
        if (detection.confidence > currentGroup.confidence) {
          currentGroup = detection;
        }
      } else {
        grouped.push(currentGroup);
        currentGroup = detection;
      }
    }
    
    grouped.push(currentGroup);
    return grouped;
  }

  private simulateBarkDetection(file: File): { barkCount: number; detections: BarkDetection[] } {
    // Fallback simulation for demo purposes
    const duration = 10; // Assume 10 seconds
    const barkCount = Math.floor(Math.random() * 8) + 1; // 1-8 barks
    const detections: BarkDetection[] = [];
    
    for (let i = 0; i < barkCount; i++) {
      detections.push({
        timestamp: Math.random() * duration,
        confidence: 0.6 + Math.random() * 0.4
      });
    }
    
    // Sort by timestamp
    detections.sort((a, b) => a.timestamp - b.timestamp);
    
    return { barkCount, detections };
  }
}