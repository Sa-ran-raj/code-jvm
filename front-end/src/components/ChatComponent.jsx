import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, MessageCircle } from 'lucide-react';

const ChatComponent = ({ currentUser, selectedVolunteer }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);


    newSocket.emit('join', currentUser.id);

    newSocket.on('receiveMessage', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => newSocket.close();
  }, [currentUser]);

  useEffect(() => {
    if (socket && selectedVolunteer) {
      socket.emit('getMessageHistory', {
        user1: currentUser.id,
        user2: selectedVolunteer.id
      });

      socket.on('messageHistory', (history) => {
        setMessages(history);
      });
    }
  }, [socket, selectedVolunteer, currentUser]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && socket && selectedVolunteer) {
      socket.emit('sendMessage', {
        sender: currentUser.id,
        receiver: selectedVolunteer.id,
        message: newMessage
      });

      // Optimistically add message to UI
      setMessages(prevMessages => [...prevMessages, {
        sender: currentUser.id,
        message: newMessage,
        timestamp: new Date()
      }]);

      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 relative"
      >
        <MessageCircle />
        {/* Unread message indicator */}
        {messages.some(m => !m.read) && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white border rounded-lg shadow-xl">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">
              Chat with {selectedVolunteer.name}
            </h3>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${
                  msg.sender === currentUser.id 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <div 
                  className={`p-2 rounded-lg max-w-[70%] ${
                    msg.sender === currentUser.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.message}
                  <div className="text-xs opacity-70 text-right mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t flex items-center">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button 
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;