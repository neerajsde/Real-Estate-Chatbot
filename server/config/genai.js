import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { config } from 'dotenv';
config();

// Initialize AI instance
const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

// Read and format property data once
const properties = JSON.parse(fs.readFileSync('./data/property/merged.json', 'utf-8'));

// Format property descriptions for system context
const formattedProperties = properties
  .map((p, idx) => 
    `${idx + 1}. ${p.title} (${p.location}) - ₹${p.price.toLocaleString()} - ${p.size_sqft} sqft - ${p.amenities.join(', ')}`
  )
  .join('\n');

// Define AI assistant's system instruction (context)
const systemContext = `
You are Mira and your name is Mira, a friendly and intelligent AI real estate assistant.
Your job is to help users understand and explore property listings based on their queries.

Here are the properties available:
${formattedProperties}

Provide clear, helpful answers. You can recommend properties, filter by location, budget, size, or amenities.
Be concise, friendly, and focus on user needs.
`;

// Function to handle LLM call with history
export async function llmCall(chatsHistory) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: chatsHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      },
      config:{
        systemInstruction:systemContext
      }
    });

    const reply = response.text || 'Sorry, I couldn’t process that.';
    return { role: 'model', parts: [{ text: reply }] };
  } catch (error) {
    console.error('Error during LLM call:', error.message);
    return { role: 'model', parts: [{ text: 'An error occurred while processing your request.' }] };
  }
}
