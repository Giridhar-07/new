import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaTimes, FaRobot, FaUser } from "react-icons/fa";
import { generateResponse } from "../services/geminiService";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "Hello! I'm your hotel assistant. How can I help you today?",
      type: "bot",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

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
      const response = await generateResponse(currentInput);
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
          content: "I apologize, but I'm having trouble processing your request. Please try again.",
          type: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        type: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const formatMessage = (text) => {
    return text
      .split("\n")
      .map((paragraph, index) => 
        paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
      );
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chatbot ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={handleToggle} aria-label="Toggle chat">
        <FaRobot />
      </button>

      <div className="chat-container">
        <div className="chat-header">
          <h3>Hotel Assistant</h3>
          <button className="close-button" onClick={handleToggle} aria-label="Close chat">
            <FaTimes />
          </button>
        </div>

        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.type === "user" ? "user" : "bot"}`}
            >
              <div className="message-icon">
                {message.type === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div className="message-content">
                {formatMessage(message.content)}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
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
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
