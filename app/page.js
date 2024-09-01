import { FaRobot } from "react-icons/fa";
import ChatInterface from "../components/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          Chatbot 🤖
        </h1>
        <ChatInterface />
      </main>
    </div>
  );
}
