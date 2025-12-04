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