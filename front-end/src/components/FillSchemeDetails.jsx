import React, { useState } from 'react';
const FillSchemeDetails = ({ onSubmit }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [incomeLevel, setIncomeLevel] = useState('');
  const [community, setCommunity] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [disabilityStatus, setDisabilityStatus] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const handleSubmit = () => {
    if (
      age && gender && incomeLevel && community && employmentStatus && disabilityStatus && state && district
    ) {
      onSubmit({ age, gender, incomeLevel, community, employmentStatus, disabilityStatus, state, district });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-purple-100 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Fill Scheme Details</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">Income Level</label>
        <input
          type="text"
          value={incomeLevel}
          onChange={(e) => setIncomeLevel(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>


      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">Community</label>
        <input
          type="text"
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">Employment Status</label>
        <select
          value={employmentStatus}
          onChange={(e) => setEmploymentStatus(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Employment Status</option>
          <option value="Employed">Employed</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Self-Employed">Self-Employed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">Disability Status</label>
        <select
          value={disabilityStatus}
          onChange={(e) => setDisabilityStatus(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Disability Status</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">State</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-700 mb-2">District</label>
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Submit Scheme Details
      </button>
    </div>
  );
};

export default FillSchemeDetails;
