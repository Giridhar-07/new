const API_KEY = 'AIzaSyDHF9zvQcjeqhlV2HArbq5cm8cFmxa5Gt8'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const systemPrompt = `You are a helpful hotel assistant. You can:
1. Answer questions about hotel amenities, services, and policies
2. Help with room bookings
3. Provide information about room types and availability
4. Assist with special requests
5. Guide users through the booking process

Hotel Information:
- Room types: Standard, Deluxe, Suite
- Amenities: Pool, Spa, Restaurant, Gym, WiFi
- Check-in: 2 PM, Check-out: 11 AM
- Booking requires: Name, Email, Check-in/out dates, Room type
`;

class GeminiService {
  async generateResponse(userMessage) {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
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
            }
          ]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get response from Gemini');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async processBookingIntent(userMessage) {
    try {
      // Enhanced prompt for booking-related queries
      const bookingPrompt = `${systemPrompt}
      
Task: Analyze if this is a booking request and extract booking details if present.
User message: ${userMessage}

Respond in JSON format:
{
  "isBookingRequest": boolean,
  "extractedDetails": {
    "dates": {
      "checkIn": "YYYY-MM-DD or null",
      "checkOut": "YYYY-MM-DD or null"
    },
    "roomType": "standard/deluxe/suite or null",
    "guestCount": number or null,
    "specialRequests": "string or null"
  },
  "missingInfo": ["list of required missing information"],
  "response": "your response to the user"
}`;

      const response = await this.generateResponse(bookingPrompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Booking Processing Error:', error);
      throw error;
    }
  }

  async handleFollowUp(conversation, userMessage) {
    try {
      const conversationPrompt = `${systemPrompt}
Previous conversation:
${conversation.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

Current user message: ${userMessage}

Analyze the conversation context and provide a relevant response.`;

      return await this.generateResponse(conversationPrompt);
    } catch (error) {
      console.error('Follow-up Processing Error:', error);
      throw error;
    }
  }
}

export default new GeminiService();
