"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";
import Message from "./Message";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
    };
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const botMessage = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        botMessage,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="h-[calc(100vh-300px)] overflow-y-auto mb-4 pr-4">
          {messages.map((message, index) => (
            <Message
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={sendMessage}
          className="flex"
        >
          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            className="flex-grow mr-2 p-2 border border-gray-300 rounded"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading}
          >
            <FaPaperPlane className="mr-2" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
