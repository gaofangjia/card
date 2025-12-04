
export enum TransportType {
  TRAIN = 'TRAIN',
  FLIGHT = 'FLIGHT'
}

export interface TicketData {
  type: TransportType;
  origin: string;       // e.g., 北京 Beijing
  destination: string;  // e.g., 上海 Shanghai
  number: string;       // e.g., G123 or CA9876
  date: string;         // YYYY-MM-DD
  time: string;         // HH:mm
  passengerName: string;
  gateOrSeat: string;   // "12A" or "Gate 5"
  extraInfo?: string;   // "Check-in 2 hrs before"
}

export const INITIAL_TICKET: TicketData = {
  type: TransportType.TRAIN,
  origin: '',
  destination: '',
  number: '',
  date: '',
  time: '',
  passengerName: '',
  gateOrSeat: '',
  extraInfo: ''
};

export enum AIProvider {
  GEMINI_ENV = 'GEMINI_ENV',       // Uses process.env.API_KEY
  GEMINI_CUSTOM = 'GEMINI_CUSTOM', // User provided Gemini Key
  OPENAI = 'OPENAI',               // OpenAI Compatible (Ollama, DeepSeek, etc.)
}

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export const DEFAULT_SETTINGS: AISettings = {
  provider: AIProvider.GEMINI_ENV,
  apiKey: '',
  baseUrl: 'http://localhost:11434/v1',
  model: 'gemini-2.5-flash'
};

export const STORAGE_KEY_SETTINGS = 'elder_journey_settings';
