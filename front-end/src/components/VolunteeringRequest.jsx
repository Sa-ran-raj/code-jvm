import React, { useState } from "react";
import { MapPin, CheckCircle2, XCircle } from "lucide-react";

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phoneNo: "",
    volunteerLanguage: "",
    location: "",
    coordinates: null
  });
  const [selectedDates, setSelectedDates] = useState([]);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const LANGUAGES = [
    "Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", 
    "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu", 
    "Odia", "Assamese", "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus({ message: "Geolocation not supported", type: "error" });
      return;
    }

    setLoading(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const { latitude, longitude } = position.coords;
      
      // Using OpenStreetMap's Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'VolunteerApp' // Required by Nominatim's terms of use
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location details');
      }

      const data = await response.json();
      
      // Construct location string from address components
      const address = data.address;
      const locationString = [
        address.suburb || address.neighbourhood || address.residential,
        address.city || address.town || address.village,
        address.state,
        address.postcode
      ].filter(Boolean).join(', ');

      setFormData(prev => ({
        ...prev,
        location: locationString,
        coordinates: { 
          latitude: parseFloat(latitude.toFixed(6)), 
          longitude: parseFloat(longitude.toFixed(6)) 
        }
      }));

      setStatus({ 
        message: "Location successfully detected", 
        type: "success" 
      });
    } catch (error) {
      console.error('Location error:', error);
      let errorMessage = "Unable to retrieve location. ";
      
      if (error.code) {
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage += "Please enable location access in your browser settings.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage += "Location information unavailable.";
            break;
          case 3: // TIMEOUT
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Please try again or enter manually.";
        }
      } else {
        errorMessage += "Please try again or enter manually.";
      }
      
      setStatus({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedDates.length === 0) {
      setStatus({ message: "Select at least one available date", type: "error" });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNo)) {
      setStatus({ message: "Invalid phone number", type: "error" });
      return;
    }

    try {
      setLoading(true);
      // Replace this with your actual API endpoint
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          availableDates: selectedDates
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      setStatus({ message: "Registration successful!", type: "success" });
      
      // Reset form
      setFormData({
        name: "", age: "", gender: "", phoneNo: "",
        volunteerLanguage: "", location: "", coordinates: null
      });
      setSelectedDates([]);
    } catch (error) {
      setStatus({ 
        message: "Registration failed. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Rest of the JSX remains exactly the same as your original code
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 space-y-8">
        <h2 className="text-4xl font-extrabold text-center text-purple-800 mb-8">
          Volunteer Registration
        </h2>

        {status.message && (
          <div className={`p-5 rounded-xl text-center text-lg font-semibold ${
            status.type === 'success' 
              ? 'bg-green-100 text-green-900' 
              : 'bg-red-100 text-red-900'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="inline mr-3" size={24} /> : <XCircle className="inline mr-3" size={24} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
                min="16"
                max="100"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                pattern="[6-9]\d{9}"
                maxLength="10"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Volunteer Language</label>
            <select
              name="volunteerLanguage"
              value={formData.volunteerLanguage}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Language</option>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-lg font-medium text-gray-700 mb-2">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={loading ? 'Detecting location...' : 'Click detect or enter manually'}
                className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                required
              />
              <button 
                type="button" 
                onClick={getLocation}
                disabled={loading}
                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 flex items-center gap-2"
              >
                <MapPin size={24} />
                {loading ? 'Detecting...' : 'Detect'}
              </button>
            </div>
            {formData.coordinates && (
              <p className="mt-2 text-sm text-gray-500">
                Coordinates: {formData.coordinates.latitude}, {formData.coordinates.longitude}
              </p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Select Available Dates
            </label>
            <input
              type="date"
              onChange={(e) => {
                const date = e.target.value;
                setSelectedDates(prev => 
                  prev.includes(date) 
                    ? prev.filter(d => d !== date)
                    : [...prev, date].sort()
                );
              }}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
            
            {selectedDates.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedDates.map(date => (
                  <div 
                    key={date} 
                    className="flex justify-between items-center bg-purple-100 p-3 rounded-xl"
                  >
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <button 
                      type="button"
                      onClick={() => setSelectedDates(prev => prev.filter(d => d !== date))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-xl transition duration-300 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
            }`}
          >
            {loading ? 'Processing...' : 'Register as Volunteer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerForm;