import React, { useState } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    // Placeholder for Gemini API integration
    const geminiResponse = getGeminiResponse(newMessage);
    setMessages([...messages, { text: newMessage, sender: 'user' }, { text: geminiResponse, sender: 'bot' }]);
    setNewMessage('');
  };

  const getGeminiResponse = (message) => {
    // Replace with actual Gemini API call
    return `This is a placeholder response from Gemini for: ${message}`;
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={toggleChatbot}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        {isOpen ? 'Close Chatbot' : 'Open Chatbot'}
      </button>

      {isOpen && (
        <div className="bg-white rounded shadow-md p-4 w-96 h-64 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>{message.text}</span>
            </div>
          ))}
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
