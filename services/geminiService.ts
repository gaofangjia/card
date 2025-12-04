import { GoogleGenAI, Type } from "@google/genai";
import { TicketData, TransportType } from "../types";

const parseTicketText = async (text: string): Promise<TicketData | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following text which contains travel information (either a flight or a train ticket).
    Extract the following information into a strict JSON object:
    - type: "TRAIN" or "FLIGHT"
    - origin: Departure city/station
    - destination: Arrival city/station
    - number: Flight number (e.g., CA1234) or Train number (e.g., G123)
    - date: Date in YYYY-MM-DD format. If year is missing, assume current year.
    - time: Departure time in HH:mm format (24 hour).
    - passengerName: Name of the passenger if available.
    - gateOrSeat: Seat number (for train) or Gate/Seat (for flight).
    - extraInfo: Any short important note (e.g., "Check terminal 2").

    Input Text:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["TRAIN", "FLIGHT"] },
            origin: { type: Type.STRING },
            destination: { type: Type.STRING },
            number: { type: Type.STRING },
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            passengerName: { type: Type.STRING },
            gateOrSeat: { type: Type.STRING },
            extraInfo: { type: Type.STRING },
          },
          required: ["type", "origin", "destination", "date", "time"],
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Map string enum back to our internal enum if needed, though they match here
    return {
      type: result.type === 'FLIGHT' ? TransportType.FLIGHT : TransportType.TRAIN,
      origin: result.origin || '',
      destination: result.destination || '',
      number: result.number || '',
      date: result.date || '',
      time: result.time || '',
      passengerName: result.passengerName || '',
      gateOrSeat: result.gateOrSeat || '',
      extraInfo: result.extraInfo || '',
    };
  } catch (error) {
    console.error("Error parsing ticket text:", error);
    return null;
  }
};

export { parseTicketText };