import openai from '../config/openai.js';

// 🔍 1. Extract filters from user's natural language input
export async function extractPropertyFilters(userInput) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a real estate assistant. Extract user requirements from their natural language message into structured JSON."
      },
      {
        role: "user",
        content: `User: ${userInput}\n\nRespond with a JSON like { location, bedrooms, maxPrice, amenities[] }`
      }
    ],
    temperature: 0.2
  });

  const content = response.choices[0].message;

  try {
    const json = JSON.parse(content);
    return json;
  } catch (e) {
    console.error("Failed to parse JSON:", content);
    return null;
  }
}

// 💬 2. Answer general questions in chatbot style
export async function getBotAnswer(userQuestion) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {
        role: "system",
        content: `
You are Mira, a friendly and smart real estate chatbot.
Your job is to help the user add a property or search for one.
Always try to collect the following information step by step if it's missing:
- Property name
- Location
- Budget (max price)
- Number of bedrooms
- Area (in sqft)

Ask only one missing detail at a time in a short and friendly tone.
Once all information is collected, say "Great! I'm ready to find the perfect match or save your property."
Keep responses short, simple, and helpful.
        `.trim()
      },
      {
        role: "user",
        content: userQuestion
      }
    ],
    temperature: 0.5
  });

  const botMessage = response.choices[0].message;
  return botMessage;
}

// answere personailize
export async function getBotAnswerWithUser(userQuestion, user) {
  const { name, city, preferences } = user || {};

  const preferenceSummary = preferences
    ? `The user prefers properties in ${preferences.location} with a budget up to ₹${preferences.budget}, ${preferences.bedrooms} bedrooms, and around ${preferences.size_sqft} sqft area.`
    : "No specific property preferences are provided yet.";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are Mira, a smart and friendly real estate chatbot.
You are chatting with a user named ${name || "Guest"}, who lives in ${city || "an unknown city"}.
${preferenceSummary}

Be polite, helpful, and answer naturally.
Personalize responses by referring to the user by name if possible.
If the user is asking about property help, guide them based on their preferences.
Ask for missing details (like location, budget, bedrooms, or size) if needed.
        `.trim()
      },
      {
        role: "user",
        content: userQuestion
      }
    ],
    temperature: 0.6
  });

  const botMessage = response.choices[0].message;
  return botMessage;
}