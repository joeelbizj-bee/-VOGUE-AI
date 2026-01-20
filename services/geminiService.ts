
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateFashionPortrait = async (base64Image: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Generate a high-end fashion portrait of the man in the attached photo. 
    He must have the exact same facial features and identity as the person in the provided image.
    He is wearing a stylish, modern high-fashion outfit: a tailored dark velvet blazer, a crisp premium white shirt, and a classic wide-brimmed cowboy kofia (hat) with a decorative leather band.
    His pose is confident and sophisticated, suitable for a fashion magazine cover.
    The setting is a cinematic urban backdrop during golden hour, with soft, directional lighting that emphasizes his facial structure and the textures of his clothing.
    Ultra-realistic, 8k resolution, cinematic lighting, sharp focus, fashion magazine aesthetic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove the data:image/png;base64, prefix
              mimeType: 'image/png'
            }
          },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Failed to extract image from response.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
