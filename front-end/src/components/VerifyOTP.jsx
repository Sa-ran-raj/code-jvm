import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp }),
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              required
              className="w-full p-2 border rounded"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
            >
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
