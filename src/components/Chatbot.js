import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import geminiService from '../services/geminiService';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message when first opened
      setTimeout(() => {
        setMessages([
          {
            text: "Hello! I'm your hotel assistant. How can I help you today? You can ask about our rooms, amenities, or make a booking.",
            sender: 'bot'
          }
        ]);
      }, 500);
    }
  };

  const processResponse = async (response) => {
    try {
      // Check if this is a booking intent
      const bookingResult = await geminiService.processBookingIntent(response);
      
      if (bookingResult.isBookingRequest) {
        if (bookingResult.missingInfo.length === 0) {
          // All booking information is present
          const confirmMessage = `Great! I'll help you book a ${bookingResult.extractedDetails.roomType} room.
            \nCheck-in: ${bookingResult.extractedDetails.checkIn}
            \nCheck-out: ${bookingResult.extractedDetails.checkOut}
            \nGuests: ${bookingResult.extractedDetails.guestCount}
            ${bookingResult.extractedDetails.specialRequests ? `\nSpecial requests: ${bookingResult.extractedDetails.specialRequests}` : ''}
            \nWould you like to proceed with the booking?`;
          
          return {
            text: confirmMessage,
            booking: bookingResult.extractedDetails
          };
        }
        
        // Ask for missing information
        return {
          text: `${bookingResult.response}\n\nPlease provide the following information: ${bookingResult.missingInfo.join(', ')}`
        };
      }
      
      // Regular conversation
      const aiResponse = await geminiService.handleFollowUp(messages, response);
      return { text: aiResponse };
    } catch (error) {
      console.error('Error processing response:', error);
      return {
        text: "I apologize, but I'm having trouble processing your request. Please try again or contact our front desk for immediate assistance."
      };
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { text: newMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await processResponse(newMessage);
      setIsTyping(false);

      const botMessage = { text: response.text, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

      // If this is a complete booking request, redirect to booking page
      if (response.booking) {
        setTimeout(() => {
          navigate('/booking', { state: { bookingDetails: response.booking } });
        }, 2000);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: "I apologize, but I'm having trouble right now. Please try again later.",
        sender: 'bot'
      }]);
    }
  };

  return (
    <div className="chatbot-container">
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChatbot}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="chatbot-title">Hotel Assistant</span>
            <div className="chatbot-status"></div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              className="message-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="send-button">
              <span>Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
