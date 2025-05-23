import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaRobot, FaComments } from 'react-icons/fa';
import { sendMessageToGemini } from '../services/geminiService';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

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
      const botMessage = {
        type: 'bot',
        content: response
      };
      setMessages(prev => [...prev, botMessage]);
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
    // Split content into paragraphs
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

      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
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
          {isTyping && (
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
          />
          <button 
            type="submit"
            className="send-button"
            disabled={!inputMessage.trim() || isTyping}
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
