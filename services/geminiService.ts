
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { RPI } from "../types";
import { decode, decodeAudioData } from "./audioUtils.ts";

const API_KEY = process.env.API_KEY || "";

export const getRootCauseSuggestion = async (rpi: RPI) => {
  if (!API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Act as a Senior Regulatory QA Expert. Analyze the following underperforming Regulatory Performance Indicator (RPI) for NAFDAC (Nigeria). 
  RPI Code: ${rpi.code}
  Description: ${rpi.description}
  Current Value: ${rpi.currentValue}${rpi.unit}
  Target: ${rpi.target}${rpi.unit}
  Baseline: ${rpi.baseline}${rpi.unit}
  Status: ${rpi.status}
  
  Suggest 3 possible root causes for this variance and 3 specific corrective actions to align with WHO GBT ML4 requirements (Continuous Improvement). Respond in structured JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            root_causes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            corrective_actions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            ml4_justification: {
                type: Type.STRING
            }
          },
          required: ["root_causes", "corrective_actions", "ml4_justification"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const generateSpeech = async (text: string) => {
  if (!API_KEY) return;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and professionally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioContext,
        24000,
        1
      );
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      return source;
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};
