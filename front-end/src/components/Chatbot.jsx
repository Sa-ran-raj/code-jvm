import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Volume2, Loader2, Bot, User, X, Pause, Play, ExternalLink, Sparkles, History, MessageSquare, HelpCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const detectLanguage = async (text) => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/detect?client=gtx&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data?.data?.detections?.[0]?.[0]?.language || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
};

const translateText = async (text, targetLang) => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data[0].map(x => x[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

const supportedLanguages = {
  en: 'English',
  hi: 'हिंदी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
  or: 'ଓଡ଼ିଆ'
};

const generateDynamicSuggestions = (lastBotMessage, selectedLanguage) => {
  const contextualSuggestions = {
    default: [
      "What are the eligibility criteria?",
      "How can I apply?",
      "What documents do I need?",
      "What are the benefits?",
      "Are there any recent updates?"
    ],
    schemes: [
      "Eligibility details",
      "Application process",
      "Financial benefits",
      "Required documents",
      "State-specific variations"
    ],
    location: [
      "Schemes in this region",
      "Local application centers",
      "Regional eligibility criteria",
      "Additional local support",
      "Implementation status"
    ]
  };

  const messageKeywords = lastBotMessage.toLowerCase().split(/\s+/);
  const matchedCategory = 
    messageKeywords.some(keyword => ['scheme', 'yojana', 'program', 'policy'].includes(keyword)) ? 'schemes' :
    messageKeywords.some(keyword => ['state', 'district', 'region', 'local'].includes(keyword)) ? 'location' :
    'default';

  return contextualSuggestions[matchedCategory];
};

const ChatMessage = ({ message, onSpeak, isSpeaking, onPause, currentSpeakingMessage, resumeSpeech }) => {
  const isBot = message.type === 'bot';
  
  const renderLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
        >
          {part.length > 50 ? part.substring(0, 50) + '...' : part}
          <ExternalLink size={12} className="ml-1" />
        </a>
      ) : part
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex items-start space-x-2 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`p-2 rounded-full shadow-md ${isBot ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
            {isBot ? <Sparkles className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
          </div>
          <div className={`p-4 rounded-2xl shadow-lg ${isBot ? 'bg-gray-100 border border-gray-200' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'}`}>
            <p className="text-sm whitespace-pre-wrap">{renderLinks(message.text)}</p>
            {message.applicationLink && (
              <a
                href={message.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 mt-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ExternalLink size={16} />
                <span className="text-sm font-semibold">Official Application Portal</span>
              </a>
            )}
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs opacity-50">{message.timestamp}</span>
              {isBot && (
                <div className="flex items-center space-x-2">
                  {isSpeaking ? (
                    <button
                      onClick={onPause}
                      className="text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      <Pause size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={currentSpeakingMessage === message.text ? resumeSpeech : () => onSpeak(message.text)}
                      className="text-gray-500 hover:text-indigo-500 transition-colors"
                    >
                      <Play size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FollowUpSuggestions = ({ onSuggest, lastBotMessage, selectedLanguage }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const defaultSuggestions = generateDynamicSuggestions(lastBotMessage || '', selectedLanguage);
      if (selectedLanguage !== 'en') {
        const translatedSuggestions = await Promise.all(
          defaultSuggestions.map(suggestion => translateText(suggestion, selectedLanguage))
        );
        setSuggestions(translatedSuggestions);
      } else {
        setSuggestions(defaultSuggestions);
      }
    };
    loadSuggestions();
  }, [lastBotMessage, selectedLanguage]);

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggest(suggestion)}
          className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

const QuestionHistorySidebar = ({ history, onHistorySelect }) => {
  const groupedHistory = history.reduce((acc, question) => {
    const key = question.split(' ')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(question);
    return acc;
  }, {});

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto">
      <div className="flex items-center mb-4">
        <History className="mr-2 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Question History</h3>
      </div>
      {Object.entries(groupedHistory).map(([category, questions]) => (
        <div key={category} className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-2 capitalize">{category}</h4>
          <ul className="space-y-2">
            {questions.slice(-3).map((question, index) => (
              <li 
                key={index}
                onClick={() => onHistorySelect(question)}
                className="p-2 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors text-sm truncate"
              >
                {question}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => (
  <select
    value={selectedLanguage}
    onChange={(e) => onLanguageChange(e.target.value)}
    className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-blue-700"
  >
    {Object.entries(supportedLanguages).map(([code, name]) => (
      <option key={code} value={code}>
        {name}
      </option>
    ))}
  </select>
);

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const chatContainerRef = useRef(null);
  const recognition = useRef(null);
  const synth = useRef(window.speechSynthesis);
  const currentUtterance = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const setupSpeechRecognition = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return null;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = selectedLanguage;

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      setIsListening(false);
      setError('Speech recognition failed. Please try again or type your message.');
      console.error('Speech Recognition Error:', event.error);
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setTimeout(() => handleSend(transcript), 500);
    };

    return recognitionInstance;
  };

  const speakText = (text) => {
    if (!synth.current) return;

    synth.current.cancel();
    setCurrentSpeakingMessage(text);

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance.current = utterance;
    utterance.lang = selectedLanguage;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingMessage(null);
    };
    utterance.onpause = () => setIsSpeaking(false);
    utterance.onresume = () => setIsSpeaking(true);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setCurrentSpeakingMessage(null);
      setError('Text-to-speech failed. Please try again.');
    };

    synth.current.speak(utterance);
  };

  const pauseSpeech = () => {
    if (synth.current && isSpeaking) {
      synth.current.pause();
      setIsSpeaking(false);
    }
  };

  const resumeSpeech = () => {
    if (synth.current && currentUtterance.current) {
      synth.current.resume();
      setIsSpeaking(true);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);
    } else {
      recognition.current = setupSpeechRecognition();
      recognition.current.start();
    }
  };

  const handleSuggestedFollow = (suggestion) => {
    setUserInput(suggestion);
    handleSend(suggestion);
  };

  const handleHistorySelect = (selectedQuestion) => {
    setUserInput(selectedQuestion);
    handleSend(selectedQuestion);
  };

  const handleSend = async (inputToSend = userInput) => {
    if (inputToSend.trim() === '' || loading) return;
    setShowWelcome(false);
  
    try {
      setLoading(true);
      setError(null);
  
      const userMessage = {
        type: 'user',
        text: inputToSend,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, userMessage]);
  
      const detectedLang = await detectLanguage(inputToSend);
      let translatedInput = inputToSend;
      
      if (detectedLang !== 'en') {
        translatedInput = await translateText(inputToSend, 'en');
      }
  
      const response = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json' },
        body: JSON.stringify({ question: translatedInput }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        let finalResponse = data.answer.replace(/\*{1,3}/g, ""); // Removes *, **, and ***
  
        if (selectedLanguage !== 'en') {
          finalResponse = await translateText(finalResponse, selectedLanguage);
        }
  
        const botResponse = {
          type: 'bot',
          text: finalResponse,
          originalText: selectedLanguage !== 'en' ? data.answer.replace(/\*{1,3}/g, "") : null,
          applicationLink: data.applicationLink,
          timestamp: new Date().toLocaleTimeString()
        };
  
        setChatHistory(prev => [...prev, botResponse]);
        setQuestionHistory(prev => {
          const updatedHistory = [...prev, inputToSend];
          return updatedHistory.slice(-15);
        });
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get response. Please try again.');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        isError: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
      setUserInput('');
    }
  };
  
  const handleLanguageChange = async (newLanguage) => {
    setSelectedLanguage(newLanguage);
    if (recognition.current) {
      recognition.current.lang = newLanguage;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 flex">
      <QuestionHistorySidebar 
        history={questionHistory} 
        onHistorySelect={handleHistorySelect}
      />
      
      <div className="flex-grow max-w-4xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="w-8 h-8" /> Gov Schemes AI Assistant
            </h1>
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg">
              <Globe className="w-5 h-5 text-white" />
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                className="bg-transparent text-white font-semibold border-none focus:outline-none cursor-pointer"
              />
            </div>
          </div>
          <p className="text-sm text-white/80 mt-2">
            Your intelligent guide to government schemes and policies
          </p>
        </div>

        <div className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-lg flex justify-between items-center"
              >
                <p>{error}</p>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <X size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            ref={chatContainerRef}
            className="bg-gray-50 rounded-xl p-4 h-[500px] overflow-y-auto mb-4 space-y-4 scroll-smooth border border-gray-200"
          >
            <AnimatePresence>
              {showWelcome ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center h-full"
                >
                  <div className="text-center text-gray-600">
                    <Sparkles size={64} className="mx-auto mb-4 text-indigo-500" />
                    <h2 className="text-2xl font-bold mb-2 text-indigo-700">Welcome to Gov Schemes AI</h2>
                    <p className="mb-4">Your intelligent assistant for government schemes</p>
                    <div className="bg-indigo-50 p-4 rounded-xl inline-block">
                      <p>Try asking about:</p>
                      <ul className="text-left list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>PM Kisan Samman Nidhi Yojana</li>
                        <li>Ayushman Bharat Scheme</li>
                        <li>Student scholarship programs</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                chatHistory.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    isLast={index === chatHistory.length - 1}
                    onSpeak={speakText}
                    onPause={pauseSpeech}
                    resumeSpeech={resumeSpeech}
                    isSpeaking={isSpeaking && currentSpeakingMessage === message.text}
                    currentSpeakingMessage={currentSpeakingMessage}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 flex-col">
            <div className="flex gap-3">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Ask about any government scheme in ${supportedLanguages[selectedLanguage]}...`}
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white transition-all resize-none"
                rows="2"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                className={`p-4 rounded-xl ${isListening ? 'bg-red-500' : 'bg-indigo-500'} text-white transition-colors`}
              >
                <Mic className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={loading}
                className="p-4 bg-purple-500 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </motion.button>
            </div>
            <FollowUpSuggestions 
              onSuggest={handleSuggestedFollow} 
              lastBotMessage={chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].text : ''}
              selectedLanguage={selectedLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

          