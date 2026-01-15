import { GoogleGenAI } from "@google/genai";

// Declare process to avoid TypeScript errors without @types/node
declare const process: any;

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends text and an image to the Gemini model for analysis.
 */
export const analyzeImageWithPrompt = async (
  prompt: string, 
  base64Image: string, 
  mimeType: string
): Promise<string> => {
  try {
    // Using gemini-3-flash-preview for multimodal tasks (text + image input).
    // gemini-2.5-flash-image is for image generation.
    const modelId = 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }
        ]
      },
      config: {
        // Optional: reduce temperature for more analytical/compiler-like responses
        temperature: 0.4, 
      }
    });

    return response.text || "Нет ответа от модели.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Ошибка при обращении к нейросети.");
  }
};
