import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaComments } from 'react-icons/fa';
import { sendMessageToGemini } from '../services/geminiService';
import useTypingEffect from '../hooks/useTypingEffect';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const { displayedText, isComplete } = useTypingEffect(typingMessage, 30);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your hotel assistant. How can I help you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (typingMessage) {
      scrollToBottom();
    }
  }, [typingMessage, displayedText, scrollToBottom]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping || typingMessage) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: inputMessage
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get bot response
      const response = await sendMessageToGemini(inputMessage);
      setTypingMessage(response);
      
      // Wait for typing animation to complete
      await new Promise(resolve => setTimeout(resolve, response.length * 30));
      
      const botMessage = {
        type: 'bot',
        content: response
      };
      setMessages(prev => [...prev, botMessage]);
      setTypingMessage('');
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = {
        type: 'bot',
        content: 'I apologize, but I\'m having trouble processing your request. Please try again.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessage = (content) => {
    if (!content) return null;
    return content.split('\n').map((paragraph, index) => (
      paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
    ));
  };

  return (
    <>
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        aria-label="Toggle chat"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>

      <div 
        className={`chatbot-container ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Chat with hotel assistant"
      >
        <div className="chatbot-header">
          <div className="chatbot-title">
            <FaRobot className="bot-icon" />
            <span>Hotel Assistant</span>
          </div>
          <button 
            className="close-button"
            onClick={handleToggle}
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.type} ${message.isError ? 'error' : ''}`}
              role={message.type === 'bot' ? 'log' : 'status'}
            >
              {message.type === 'bot' && (
                <div className="bot-avatar">
                  <FaRobot />
                </div>
              )}
              <div className="message-content">
                {formatMessage(message.content)}
              </div>
            </div>
          ))}
          {typingMessage && (
            <div className="message bot typing">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                {formatMessage(displayedText)}
              </div>
            </div>
          )}
          {isTyping && !typingMessage && (
            <div className="message bot">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            ref={inputRef}
            className="message-input"
            disabled={isTyping || typingMessage}
            aria-label="Message input"
          />
          <button 
            type="submit"
            className="send-button"
            disabled={!inputMessage.trim() || isTyping || typingMessage}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </form>

        <div className="chatbot-footer">
          <p>Powered by Gemini AI</p>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
