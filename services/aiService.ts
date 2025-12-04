
import { GoogleGenAI, Type } from "@google/genai";
import { TicketData, TransportType, AIProvider, AISettings, DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS } from "../types";

// Helper to safely get Env Key
const getEnvApiKey = () => {
  try {
    // Check for standard Node.js process.env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    
    // Check for Vite import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
    }
  } catch (e) {
    // Ignore errors in environments where these globals don't exist
    console.warn("Could not retrieve env API key", e);
  }
  return undefined;
};

const getSettings = (): AISettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch (e) {
    console.error("Failed to load settings", e);
  }
  return DEFAULT_SETTINGS;
};

export const parseTicketText = async (text: string): Promise<TicketData | null> => {
  const settings = getSettings();
  
  // Decide which path to take
  if (settings.provider === AIProvider.GEMINI_ENV || settings.provider === AIProvider.GEMINI_CUSTOM) {
    return parseWithGemini(text, settings);
  } else {
    return parseWithOpenAI(text, settings);
  }
};

const parseWithGemini = async (text: string, settings: AISettings): Promise<TicketData | null> => {
  const apiKey = settings.provider === AIProvider.GEMINI_CUSTOM ? settings.apiKey : getEnvApiKey();

  if (!apiKey) {
    console.warn("API Key is missing for Gemini. Please check settings.");
    // Return null instead of throwing to avoid crashing the UI thread
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Use user model if custom, else default based on availability
  const modelName = settings.provider === AIProvider.GEMINI_CUSTOM && settings.model ? settings.model : "gemini-2.5-flash";

  const prompt = `
    Analyze the following text which contains travel information.
    Extract the information into a strict JSON object.
    Input Text: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
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
    return mapResultToTicket(result);

  } catch (error) {
    console.error("Gemini parse error:", error);
    return null;
  }
};

const parseWithOpenAI = async (text: string, settings: AISettings): Promise<TicketData | null> => {
  const { baseUrl, apiKey, model } = settings;
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const prompt = `
    You are a helpful assistant that parses travel tickets.
    Analyze the following text: "${text}"
    
    Return a JSON object with the following fields:
    - type: "TRAIN" or "FLIGHT"
    - origin: Departure city
    - destination: Arrival city
    - number: Flight/Train number
    - date: YYYY-MM-DD
    - time: HH:mm
    - passengerName: Name
    - gateOrSeat: Seat or Gate
    - extraInfo: Short note
    
    RETURN ONLY JSON. NO MARKDOWN.
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || 'ollama'}` // Ollama often ignores key but needs header
      },
      body: JSON.stringify({
        model: model || 'llama3',
        messages: [
          { role: 'system', content: 'You are a JSON parser. Output only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        stream: false,
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Clean up markdown code blocks if present
    const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(jsonStr);

    return mapResultToTicket(result);

  } catch (error) {
    console.error("OpenAI/Ollama parse error:", error);
    return null;
  }
};

const mapResultToTicket = (result: any): TicketData => {
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
};
