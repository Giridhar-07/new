import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Create and configure the Gemini AI instance
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Keep track of the chat
let chat = null;

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
  console.error("Gemini service error:", error);

  if (!GEMINI_API_KEY) {
    return "The AI service is not properly configured. Please try again later.";
  }

  if (error.message.includes("empty")) {
    return "Please enter a message.";
  }

  if (error.message.includes("too long")) {
    return "Your message is too long. Please keep it shorter.";
  }

  if (error.message.includes("rate limit") || error.message.includes("429")) {
    return "We're receiving many requests. Please try again in a moment.";
  }

  if (error.message.includes("not found") || error.message.includes("404")) {
    return "The AI service is temporarily unavailable. Please try again later.";
  }

  return "I apologize, but I'm having trouble processing your request. Please try again.";
};

/**
 * Initializes a new chat session
 */
export const startNewChat = async () => {
  try {
    if (!chat) {
      chat = model.startChat({
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      });

      // Initialize with context
      await chat.sendMessage(systemContext);
    }
    return true;
  } catch (error) {
    console.error("Failed to start chat:", error);
    return false;
  }
};

/**
 * Sends a message to the Gemini AI model
 */
export const sendMessageToGemini = async (userMessage) => {
  try {
    // Validate the message
    const validatedMessage = validateMessage(userMessage);

    // Start a new chat if none exists
    if (!chat) {
      await startNewChat();
    }

    // Send the message with context
    const result = await chat.sendMessage(validatedMessage);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error("Error in Gemini service:", error);
    return handleGeminiError(error);
  }
};

/**
 * Clears the current chat session
 */
export const clearConversationHistory = () => {
  chat = null;
  startNewChat();
};
