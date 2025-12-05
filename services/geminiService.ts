import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key is present to avoid immediate crash, though strict mode assumes env is there.
const ai = new GoogleGenAI({ apiKey });

export const generateFoodDescription = async (foodName: string, category: string): Promise<string> => {
  if (!apiKey) return "Delicious food item cooked to perfection.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, appetizing, 1-sentence description (under 15 words) for a menu item named "${foodName}" which is a "${category}" dish. No quotes.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Freshly prepared dish with premium ingredients.";
  }
};
