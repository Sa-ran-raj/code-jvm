import React, { useState, useEffect } from 'react';
import { Mic, Search, MessageCircle, Star } from 'lucide-react';
import ChatComponent from './ChatComponent'; // Assuming you've created this component

const VolunteerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('rating');
  
  // New state for chat functionality
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    id: 'user123', // This would typically come from authentication
    name: 'John Doe'  // Current logged-in user
  });

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
        // Add sample ratings and reviews to the result data
        const volunteersWithRatings = result.data.map(volunteer => ({
          ...volunteer,
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1-5
          reviews: Math.floor(Math.random() * 50) + 1, // Random number of reviews between 1-50
        }));

        // Sort volunteers based on selected option
        const sortedVolunteers = sortVolunteers(volunteersWithRatings, sortOption);

        setVolunteers(sortedVolunteers);
        if (sortedVolunteers.length === 0) {
          setMessage('No volunteers found in this location');
        } else {
          setMessage(`Found ${sortedVolunteers.length} volunteer(s) in ${location || searchTerm}`);
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

  // Function to sort volunteers
  const sortVolunteers = (volunteerList, option) => {
    switch(option) {
      case 'rating':
        return [...volunteerList].sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return [...volunteerList].sort((a, b) => b.reviews - a.reviews);
      case 'name':
        return [...volunteerList].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return volunteerList;
    }
  };

  const handleWhatsAppRedirect = (phoneNo) => {
    const cleanPhoneNo = phoneNo.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhoneNo}`, '_blank');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={20} 
        className={`inline-block ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
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

        {/* Sort Options */}
        <div className="mb-4 flex justify-end items-center space-x-4">
          <label className="text-gray-700 font-medium">Sort by:</label>
          <select 
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              // Re-sort existing volunteers when sort option changes
              setVolunteers(sortVolunteers(volunteers, e.target.value));
            }}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="rating">Highest Rating</option>
            <option value="reviews">Most Reviews</option>
            <option value="name">Name (A-Z)</option>
          </select>
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
                {/* Rating and Reviews Section */}
                <div>
                  <p className="font-semibold text-gray-700">Rating</p>
                  <div className="flex items-center">
                    {renderStars(volunteer.rating)}
                    <span className="ml-2 text-gray-600">({volunteer.rating}/5)</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Reviews</p>
                  <p>{volunteer.reviews} reviews</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleWhatsAppRedirect(volunteer.phoneNo)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                  <MessageCircle size={20} />
                  Contact on WhatsApp
                </button>
                <button
                  onClick={() => setSelectedVolunteer({
                    id: volunteer.phoneNo, // Use phone number as unique ID
                    name: volunteer.name
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  <MessageCircle size={20} />
                  Start Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedVolunteer && (
          <ChatComponent 
            currentUser={currentUser}
            selectedVolunteer={selectedVolunteer}
          />
        )}
      </div>
    </div>
  );
};

export default VolunteerSearch;