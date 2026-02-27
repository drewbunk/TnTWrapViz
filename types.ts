
export interface VehicleData {
  type: string;
  manufacturer: string;
  model: string;
  year?: string;
}

export interface DesignPreferences {
  style: string;
  colors: string[];
  theme?: string;
}

export interface DesignConcept {
  name: string;
  description: string;
  rationale: string;
}

export interface DesignObject {
  id: string;
  url: string;
  videoUrl?: string; // Cinematic video reveal
  frames?: string[]; // Multiple angles for 360 rotation
  type: 'image' | 'video';
  formData: VehicleData & DesignPreferences;
  concept: DesignConcept;
  timestamp: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  isThinking?: boolean;
}

export enum GenerationState {
  IDLE = 'IDLE',
  GENERATING_CONCEPTS = 'GENERATING_CONCEPTS',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  GENERATING_360 = 'GENERATING_360',
  GENERATING_VIDEO = 'GENERATING_VIDEO',
  THINKING = 'THINKING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
