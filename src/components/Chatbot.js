import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaTimes, FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessageToGemini, handleGeminiError, validateMessage } from "../services/geminiService";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "👋 Welcome to Hotel Paradise! I'm your virtual concierge. I can help you with:\n• Room bookings\n• Hotel amenities\n• Local attractions\n• Special requests\n\nHow may I assist you today?",
      type: "bot",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, scrollToBottom]);

  const simulateTyping = useCallback((text) => {
    return new Promise((resolve) => {
      let index = 0;
      setDisplayedText("");

      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        index++;

        if (index === text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 30);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const userMessage = {
      content: currentInput,
      type: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsTyping(true);

    try {
      const validatedMessage = validateMessage(currentInput);
      const response = await sendMessageToGemini(validatedMessage);
      setIsTyping(false);

      if (response) {
        const botMessage = {
          content: response,
          type: "bot",
        };

        setMessages((prev) => [...prev, botMessage]);
        await simulateTyping(response);
      } else {
        const errorMessage = {
          content: "I apologize for the inconvenience. For immediate assistance, please contact our front desk at +1-234-567-8900 or email us at help@hotelparadise.com",
          type: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        content: handleGeminiError(error),
        type: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const formatMessage = (text) => {
    return text.split("\n").map((paragraph, index) => (
      paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
    ));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot">
      <motion.button
        className="toggle-button"
        onClick={handleToggle}
        aria-label="Toggle chat"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 360 : 0, scale: isOpen ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaRobot style={{ color: '#3b82f6' }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-container"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="chat-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
          <h3>Hotel Assistant</h3>
              <motion.button
                className="close-button"
                onClick={handleToggle}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                aria-label="Close chat"
              >
                <FaTimes />
              </motion.button>
            </motion.div>

            <motion.div
              className="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`message ${message.type === "user" ? "user" : "bot"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
              <div className="message-icon">
                {message.type === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div className="message-content">
                {formatMessage(message.content)}
              </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  className="message bot"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
              <div className="message-icon">
                <FaRobot />
              </div>
              <div className="message-content">
                {formatMessage(displayedText)}
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="input-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping}
          />
              <motion.button
                type="submit"
                disabled={isTyping}
                whileHover={!isTyping ? { scale: 1.05 } : {}}
                whileTap={!isTyping ? { scale: 0.95 } : {}}
              >
                <FaPaperPlane />
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chatbot;
