import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { MessageCircle, Send, Sparkles, Clock } from "lucide-react";

const topics = ["PM-JAY", "PMJDY", "PMAY", "PMUY", "Clean India Mission"];

const Discussion = () => {
  const { senderName } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          sender: senderName,
          content: message,
        }),
      });

      const newMessage = await res.json();
      setMessage("");
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTimeout(fetchMessages, 500);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-violet-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8 space-x-3 animate-fade-in">
          <Sparkles className="w-8 h-8 text-teal-600 animate-float" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-violet-600 text-transparent bg-clip-text">
            Discussion Forum
          </h1>
          <Sparkles className="w-8 h-8 text-violet-600 animate-float" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                selectedTopic === topic
                  ? "bg-gradient-to-r from-teal-500 to-violet-500 text-white shadow-xl"
                  : "bg-white/80 backdrop-blur-sm text-teal-700 hover:bg-white border border-teal-200"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-teal-100">
          <div className="p-6">
            <div className="h-96 overflow-y-auto mb-6 rounded-lg scroll-smooth">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === senderName ? "justify-end" : "justify-start"
                      } animate-slide-up`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-5 py-3 shadow-md ${
                          msg.sender === senderName
                            ? "bg-blue-600 text-white"  // Changed to a professional blue
                            : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-1 text-xs font-medium opacity-90 mb-1">
                          {msg.sender}
                          <Clock className="w-3 h-3" />
                        </div>
                        <div className="text-base font-medium leading-relaxed tracking-wide">
                          {msg.content}
                        </div>
                        <div className={`text-xs mt-1 ${
                          msg.sender === senderName
                            ? "text-blue-100"  // Updated to match new color scheme
                            : "text-gray-500"
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                  <MessageCircle className="w-12 h-12 text-teal-300 animate-float" />
                  <p className="text-lg font-medium">Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 text-sm border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                  />
                  {isTyping && (
                    <div className="absolute -top-6 left-4 text-xs text-blue-600">
                      Typing...
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 group"
                >
                  Send
                  <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;