import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm here to help with your development assessment. What would you like to know?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    greeting: ["hello", "hi", "hey", "good morning", "good afternoon"],
    shed: ["shed", "storage", "workshop"],
    patio: ["patio", "deck", "outdoor area", "pergola"],
    height: ["height", "tall", "high", "metres", "meters"],
    area: ["area", "size", "square metres", "m2", "floor area"],
    boundary: ["boundary", "setback", "distance", "fence", "neighbor"],
    exempt: ["exempt", "development", "approval", "permit", "da"],
    help: ["help", "assistance", "guide", "how"]
  };

  const getResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (botResponses.greeting.some(word => lowerInput.includes(word))) {
      return "Hello! I can help you understand the development assessment process. Ask me about sheds, patios, height limits, or setback requirements.";
    }
    
    if (botResponses.shed.some(word => lowerInput.includes(word))) {
      return "For sheds: Maximum height 4m, floor area 50m², minimum 1.5m from boundaries, and lot size must be at least 450m². Need more details about any of these?";
    }
    
    if (botResponses.patio.some(word => lowerInput.includes(word))) {
      return "For patios: Maximum height 3m, floor area 40m², minimum 1m from boundaries, and lot size must be at least 300m². Want to know more about patio requirements?";
    }
    
    if (botResponses.height.some(word => lowerInput.includes(word))) {
      return "Height limits vary by structure: Sheds & Carports (4m max), Patios (3m max), Pergolas (3.5m max). Height is measured from natural ground level.";
    }
    
    if (botResponses.area.some(word => lowerInput.includes(word))) {
      return "Floor area limits: Sheds (50m²), Carports (60m²), Patios (40m²), Pergolas (35m²). This includes the total covered area of your structure.";
    }
    
    if (botResponses.boundary.some(word => lowerInput.includes(word))) {
      return "Setback requirements: Sheds & Carports need 1.5m minimum, Patios & Pergolas need 1m minimum from all property boundaries.";
    }
    
    if (botResponses.exempt.some(word => lowerInput.includes(word))) {
      return "Exempt development means you don't need council approval if your project meets all SEPP criteria. Use our assessment tool to check if your project qualifies!";
    }
    
    if (botResponses.help.some(word => lowerInput.includes(word))) {
      return "I can help with:\n• Structure requirements (sheds, patios, pergolas, carports)\n• Height and area limits\n• Setback distances\n• Exempt development rules\n\nJust ask me anything!";
    }
    
    return "I'm not sure about that. Try asking about shed requirements, patio rules, height limits, or setback distances. You can also use our assessment form to check your specific project!";
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, text: getResponse(inputText), sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Planning Assistant</h3>
            <p className="text-sm opacity-90">Ask me about development rules</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about development rules..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;