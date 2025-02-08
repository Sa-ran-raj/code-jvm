import React, { useState } from 'react';
import { Mic, Search, MessageCircle } from 'lucide-react';

const VolunteerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setMessage('Speech recognition error. Please try again.');
    };
  }

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    } else {
      setMessage('Speech recognition is not supported in your browser');
    }
  };

  const handleSearch = async (location) => {
    if (!location && !searchTerm) {
      setMessage('Please enter a location to search');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const searchUrl = `http://localhost:3000/api/volunteers/search?location=${encodeURIComponent(location || searchTerm)}`;
    
    try {
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setVolunteers(result.data);
        if (result.data.length === 0) {
          setMessage('No volunteers found in this location');
        } else {
          setMessage(`Found ${result.data.length} volunteer(s) in ${location || searchTerm}`);
        }
      } else {
        setMessage(result.error || 'Error fetching volunteers');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppRedirect = (phoneNo) => {
    const cleanPhoneNo = phoneNo.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhoneNo}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Find Volunteers</h2>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter location to search volunteers..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={startListening}
            className={`p-3 rounded-lg ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white hover:opacity-90 transition duration-200`}
            disabled={isLoading}
          >
            <Mic className={`${isListening ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {volunteers.map((volunteer, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition duration-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold text-gray-700">Name</p>
                  <p>{volunteer.name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Age</p>
                  <p>{volunteer.age}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Language</p>
                  <p>{volunteer.volunteerLanguage}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Phone</p>
                  <p>{volunteer.phoneNo}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Location</p>
                  <p>{volunteer.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Available Dates</p>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.availableDates.map((date, idx) => (
                      <span key={idx} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {new Date(date).toLocaleDateString()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleWhatsAppRedirect(volunteer.phoneNo)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                  <MessageCircle size={20} />
                  Contact on WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerSearch;