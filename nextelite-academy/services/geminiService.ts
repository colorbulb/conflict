import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// System instruction to guide the AI's persona
const SYSTEM_INSTRUCTION = `
You are "Sparky", a friendly, enthusiastic, and helpful admissions counselor for "NextElite Academy".
Our academy targets primary and secondary school students.
We offer three main pillars of education:
1. English Debate (Confidence, Public Speaking, Critical Thinking)
2. Logical Thinking (Math Olympiad prep, Puzzle solving, cognitive development)
3. AI Coding (Python, Scratch, Machine Learning basics)

Your goal is to answer questions from parents and students about our courses, schedule, and teaching philosophy.
Keep answers concise (under 3 sentences where possible), encouraging, and bright in tone.
If asked about specific prices or schedules, ask them to fill out the contact form for the latest brochure, but provide general info (e.g., "We have weekend and after-school slots!").
`;

export const getGeminiResponse = async (history: { role: string; text: string }[], userMessage: string): Promise<string> => {
  if (!API_KEY) {
    return "I'm currently resting my neural networks (API Key missing). Please try again later!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Construct the chat history for context
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I'm not sure how to answer that, but our team would love to help via the contact form!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I got a bit confused. Could you ask that again?";
  }
};