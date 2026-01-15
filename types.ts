export enum Status {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export interface FileData {
  name: string;
  type: string;
  url: string;
  base64: string; // Plain base64 string without data:image/ prefix for API
  mimeType: string;
}
