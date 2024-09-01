"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FaUser,
  FaRobot,
  FaCopy,
} from "react-icons/fa";

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          padding: "1em",
          borderRadius: "0.5em",
          fontSize: "0.9em",
        }}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={copyCode}
        className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
      >
        <FaCopy />
      </button>
      {copied && (
        <div className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded">
          Copied!
        </div>
      )}
    </div>
  );
};

export default function Message({
  role,
  content,
}) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple code detection (you might want to improve this)
  const hasCode = content.includes("```");

  const formatContent = () => {
    if (!hasCode) return content;

    const parts = content.split(
      /(```[\s\S]*?```)/
    );
    return parts.map((part, index) => {
      if (
        part.startsWith("```") &&
        part.endsWith("```")
      ) {
        const [, language, code] = part.match(
          /```(\w+)?\s*\n([\s\S]*?)\n```/
        );
        return (
          <CodeBlock
            key={index}
            code={code.trim()}
            language={language || "javascript"}
          />
        );
      }
      return <p key={index}>{part}</p>;
    });
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-3xl p-4 rounded-lg ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        } relative`}
      >
        <div className="flex items-center mb-2">
          {isUser ? (
            <FaUser className="mr-2" />
          ) : (
            <FaRobot className="mr-2" />
          )}
          <span className="font-bold">
            {isUser ? "You" : "Chat Bot"}
          </span>
        </div>
        <div className="mt-2">
          {formatContent()}
        </div>
        <button
          onClick={copyMessage}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaCopy />
        </button>
        {copied && (
          <div className="absolute top-2 right-10 bg-green-500 text-white px-2 py-1 rounded">
            Copied!
          </div>
        )}
      </div>
    </div>
  );
}
