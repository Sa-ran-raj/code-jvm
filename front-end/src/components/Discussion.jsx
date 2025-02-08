import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider"; // Import the AuthProvider to get senderName

const topics = ["PM-JAY", "PMJDY", "PMAY", "PMUY", "Clean India Mission"];

const Discussion = () => {
  const { senderName } = useAuth(); // Get dynamic username from AuthProvider
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // ✅ Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:8080/messages?topic=${encodeURIComponent(selectedTopic)}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedTopic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          sender: senderName || "Guest", // Ensure a fallback value
          content: message,
        }),
      });

      const newMessage = await res.json();
      setMessage("");

      // ✅ Append message instead of fetching all again
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // ✅ Small delay before refetching to ensure database updates
      setTimeout(fetchMessages, 500);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-purple-800">
        Discussion Forum
      </h1>
      <div className="flex justify-center space-x-4 mb-6">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
              selectedTopic === topic
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "bg-gradient-to-r from-purple-200 to-indigo-200 text-purple-800 hover:scale-105"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-3xl mx-auto">
        <div className="h-64 overflow-y-auto mb-6 border rounded-xl p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="mb-4 p-4 bg-white rounded-xl shadow-md">
                <div className="text-lg font-semibold text-purple-700">{msg.sender}</div>
                <div className="text-xl text-gray-700">{msg.content}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No messages yet.</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-purple-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg ml-3 hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Discussion;
