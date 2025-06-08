const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Initialize conversation history
let conversationHistory = [];

const systemContext = `You are a helpful hotel assistant for LuxuryStay Hotel. Your role is to:
- Provide information about hotel amenities and services
- Help with room bookings and reservations
- Answer questions about hotel policies
- Provide local area information and recommendations
- Assist with special requests and requirements
- Maintain a professional, friendly, and helpful tone
- Keep responses concise but informative
- If you can't help with something, direct users to contact hotel staff

You have access to this basic information:
- Hotel Name: LuxuryStay Hotel
- Room Types: Standard, Deluxe, and Suite
- Amenities: Pool, Spa, Gym, Restaurant, Free WiFi, Parking
- Check-in: 3 PM, Check-out: 11 AM
- Location: City Center
`;

export const sendMessageToGemini = async (message, retryCount = 0) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    // Add user message to history
    conversationHistory.push({ role: 'user', content: message });

    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemContext}\n\nUser message: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!response.ok) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return sendMessageToGemini(message, retryCount + 1);
      }
      throw new Error(`Failed to get response from Gemini: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    const formattedResponse = formatResponse(responseText);
    
    // Add bot response to history
    conversationHistory.push({ role: 'assistant', content: formattedResponse });
    
    // Keep only the last 10 messages to prevent context from getting too large
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }
    
    return formattedResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

const formatResponse = (text) => {
  // Remove any system context that might have been included
  text = text.replace(systemContext, '').trim();
  
  // Remove any "User message:" prefix that might be in the response
  text = text.replace(/^User message:.*$/m, '').trim();
  
  // Clean up any extra whitespace or newlines
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  
  return text;
};

// Helper function to check if the API key is configured
export const isGeminiConfigured = () => {
  return Boolean(GEMINI_API_KEY);
};

// Function to handle API errors
export const handleGeminiError = (error) => {
  if (!GEMINI_API_KEY) {
    return 'The AI service is not properly configured. Please set up the REACT_APP_GEMINI_API_KEY environment variable.';
  }
  
  if (error.message.includes('API key')) {
    return 'The AI service is not properly configured. Please check your API key.';
  }
  
  if (error.message.includes('rate limit')) {
    return 'The service is experiencing high traffic. Please try again in a moment.';
  }
  
  if (error.message.includes('429')) {
    return 'Too many requests. Please wait a moment before trying again.';
  }

  console.error('Gemini API Error:', error);
  return 'I apologize, but I\'m having trouble processing your request. Please try again in a moment.';
};

// Get conversation history
export const getConversationHistory = () => {
  return conversationHistory;
};

// Clear conversation history
export const clearConversationHistory = () => {
  conversationHistory = [];
};

// Function to validate messages before sending
export const validateMessage = (message) => {
  if (!message || message.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }
  
  if (message.length > 500) {
    throw new Error('Message is too long. Please keep it under 500 characters.');
  }
  
  return message.trim();
};
