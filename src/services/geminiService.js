import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Create and configure the Gemini AI instance
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Keep track of the conversation
let conversationHistory = [];

const systemContext = `You are a helpful hotel assistant for LuxuryStay Hotel. Your role is to:
- Provide information about hotel amenities and services
- Help with room bookings and reservations
- Answer questions about hotel policies
- Provide local area information and recommendations
- Assist with special requests and requirements
- Maintain a professional, friendly, and helpful tone
- Keep responses concise but informative

Hotel Information:
- Name: LuxuryStay Hotel
- Room Types: Standard, Deluxe, and Suite
- Amenities: Pool, Spa, Gym, Restaurant, Free WiFi, Parking
- Check-in: 3 PM, Check-out: 11 AM
- Location: City Center
`;

/**
 * Validates the user message
 */
export const validateMessage = (message) => {
  if (!message || message.trim().length === 0) {
    throw new Error("Message cannot be empty");
  }

  if (message.length > 500) {
    throw new Error("Message is too long. Please keep it under 500 characters.");
  }

  return message.trim();
};

/**
 * Handles errors from the Gemini service
 */
export const handleGeminiError = (error) => {
  if (!GEMINI_API_KEY) {
    return "The AI service is not properly configured. Please try again later.";
  }

  if (error.message.includes("empty")) {
    return "Please enter a message.";
  }

  if (error.message.includes("too long")) {
    return "Your message is too long. Please keep it shorter.";
  }

  if (error.message.includes("rate limit")) {
    return "We're receiving many requests. Please try again in a moment.";
  }

  console.error("Gemini service error:", error);
  return "I apologize, but I'm having trouble processing your request. Please try again.";
};

/**
 * Sends a message to the Gemini AI model
 */
export const sendMessageToGemini = async (userMessage) => {
  try {
    const validatedMessage = validateMessage(userMessage);

    // Add user message to history
    conversationHistory.push({ role: "user", parts: validatedMessage });

    // Prepare the complete message with context
    const fullMessage = `${systemContext}\n\nPrevious conversation:\n${
      conversationHistory
        .slice(-4)
        .map(msg => `${msg.role}: ${msg.parts}`)
        .join("\n")
    }\n\nUser: ${validatedMessage}`;

    // Get the response from Gemini
    const result = await model.generateContent(fullMessage);
    const response = await result.response;
    const text = response.text();

    // Add AI response to history
    conversationHistory.push({ role: "model", parts: text });

    // Keep history manageable
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    return text;
  } catch (error) {
    const errorMessage = handleGeminiError(error);
    console.error("Error in Gemini service:", error);
    return errorMessage;
  }
};

/**
 * Clears the conversation history
 */
export const clearConversationHistory = () => {
  conversationHistory = [];
};

/**
 * Gets the current conversation history
 */
export const getConversationHistory = () => {
  return [...conversationHistory];
};
