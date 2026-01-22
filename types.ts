export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  status: 'locked' | 'active' | 'completed';
  topics: string[];
}

export interface Roadmap {
  title: string;
  description: string;
  nodes: RoadmapNode[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  level: number;
  rank: string;
  skills: {
    subject: string;
    A: number; // Current value
    fullMark: number;
  }[];
  activityData: {
    name: string;
    xp: number;
  }[];
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  ROADMAP = 'ROADMAP',
  LABS = 'LABS',
  TUTOR = 'TUTOR',
  ANALYTICS = 'ANALYTICS'
}