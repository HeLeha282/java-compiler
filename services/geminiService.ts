import { GoogleGenAI } from "@google/genai";

// Declare process to avoid TypeScript errors without @types/node
declare const process: any;

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends code and optional prompt to Gemini.
 */
export const analyzeCode = async (
  code: string,
  mode: 'run' | 'debug',
  userDebugPrompt?: string
): Promise<string> => {
  try {
    const modelId = 'gemini-3-flash-preview';
    let prompt = "";

    if (mode === 'run') {
      prompt = `You are a strict Java Compiler and Runtime Environment. 
      Analyze the following Java code. 
      If there are syntax errors, output typical Java compiler error messages.
      If the code is valid, simulate its execution and output ONLY what would appear in the console (stdout).
      Do not add markdown formatting like \`\`\` or explanations outside the console output.
      
      Code:
      ${code}`;
    } else {
      prompt = `You are an expert Java Developer assistant.
      User Code:
      ${code}

      User Question/Debug Request:
      ${userDebugPrompt}

      Provide a concise and helpful answer.`;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        temperature: mode === 'run' ? 0.1 : 0.5, // Low temp for execution simulation, higher for debugging
      }
    });

    return response.text || "No output.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message}`;
  }
};