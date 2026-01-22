import { GoogleGenAI, Type } from "@google/genai";
import { Roadmap } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCareerRoadmap = async (careerGoal: string): Promise<Roadmap> => {
  const ai = getAiClient();
  
  const prompt = `Create a detailed learning roadmap for becoming a "${careerGoal}". 
  The response must be a strictly formatted JSON object matching the schema. 
  Include 5-7 distinct modules (nodes) ordered sequentially.
  Ensure 'estimatedHours' is realistic.
  The status of the first node should be 'active', others 'locked'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedHours: { type: Type.INTEGER },
                status: { type: Type.STRING, enum: ['locked', 'active', 'completed'] },
                topics: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['id', 'title', 'description', 'estimatedHours', 'status', 'topics']
            }
          }
        },
        required: ['title', 'description', 'nodes']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as Roadmap;
};

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  const ai = getAiClient();
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: "You are an expert technical mentor and career coach named 'SkillPath Bot'. You provide concise, encouraging, and technically accurate advice. You prefer practical examples. Keep responses under 200 words unless asked for deep detail.",
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text || "I couldn't generate a response.";
};

export const generateLabChallenge = async (topic: string): Promise<{ title: string, description: string, starterCode: string }> => {
  const ai = getAiClient();
  const prompt = `Create a beginner-to-intermediate coding challenge about "${topic}". 
  Return JSON with title, description, and a starter code snippet (in Python or JavaScript).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          starterCode: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate lab");
  return JSON.parse(text);
};