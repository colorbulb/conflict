
import { GoogleGenAI, Type } from "@google/genai";

export const geminiService = {
  // Senior Engineer Note: Creating a new instance per call ensures we always use the latest 
  // context/credentials and adheres to the environment-based API key handling requirements.
  
  async analyzeIStatement(statement: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this "I feel" statement for blaming language and suggest a more constructive, non-violent version if needed.
        Statement: "${statement}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isBlaming: { type: Type.BOOLEAN },
              suggestions: { type: Type.STRING },
              refinedStatement: { type: Type.STRING }
            },
            required: ['isBlaming', 'suggestions', 'refinedStatement']
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  },

  async generatePeaceTreaty(proposals: any[], summary: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a formal "Peace Treaty" contract between two partners based on these agreed proposals: ${JSON.stringify(proposals)} 
        Context: ${summary}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING },
              commitments: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'body', 'commitments']
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  }
};
