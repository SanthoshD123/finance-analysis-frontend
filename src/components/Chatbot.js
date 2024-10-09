import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { text: userMessage, user: true }]);

    try {
      const response = await api.post("/api/financial-analysis/", {
        message: userMessage,
      });

      if (response.data && response.data.response) {
        setMessages((prev) => [
          ...prev,
          {
            text: response.data.response,
            user: false,
          },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I encountered an issue while analyzing the financial data. Please try again later.",
          user: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Financial Analyst AI</h2>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.user ? "user-message" : "bot-message"
            }`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot-message">Analyzing...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about financial analysis..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
