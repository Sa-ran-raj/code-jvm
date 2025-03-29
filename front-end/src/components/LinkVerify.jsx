import React, { useState, useRef } from 'react';
import { Upload, File, Camera, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const FormAnalyser = () => {
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);


  const analyzeUploadedPhoto = async (file) => {
    setIsLoading(true);
    setError(null);

    try {

      await new Promise(resolve => setTimeout(resolve, 2000));


      const recommendations = {
        formType: 'General Identity Verification',
        requiredDocuments: [
          {
            type: 'Proof of Identity',
            examples: ['Passport', 'National ID', 'Driver\'s License'],
            reason: 'To confirm your personal identity and basic information'
          },
          {
            type: 'Proof of Address',
            examples: ['Utility Bill', 'Bank Statement', 'Lease Agreement'],
            reason: 'To verify your current residential address'
          },
          {
            type: 'Additional Identification',
            examples: ['Social Security Card', 'Birth Certificate'],
            reason: 'To provide supplementary identification support'
          }
        ],
        additionalNotes: [
          'Ensure all documents are clear and readable',
          'Documents should be valid and not expired',
          'Colored copies or high-quality scans are preferred'
        ]
      };

      setAiRecommendations(recommendations);
    } catch (err) {
      setError('Failed to analyze the photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto({
          file,
          preview: reader.result
        });
        analyzeUploadedPhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setUploadedPhoto(null);
    setAiRecommendations(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-white">
          <h1 className="text-4xl font-bold text-center text-purple-700 mb-6">
            AI Form Analyser
          </h1>

          <div className="mb-6">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
            >
              <Camera className="mr-2" /> Upload Photo for Analysis
            </button>
          </div>

          {uploadedPhoto && (
            <div className="mb-6 relative">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                <img 
                  src={uploadedPhoto.preview} 
                  alt="Uploaded" 
                  className="w-32 h-32 object-cover rounded-lg mr-4"
                />
                <div className="flex-grow">
                  <p className="font-medium">{uploadedPhoto.file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(uploadedPhoto.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button 
                  onClick={handleRemovePhoto}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-6">
              <p className="text-purple-600 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing your photo...
              </p>
            </div>
          )}

          {aiRecommendations && !isLoading && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                AI Recommendations
              </h2>
              <div className="mb-4">
                <p className="font-medium text-blue-700">
                  Form Type: {aiRecommendations.formType}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {aiRecommendations.requiredDocuments.map((doc, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <h3 className="font-semibold text-blue-700 mb-2">
                      {doc.type}
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Examples:</p>
                      <ul className="list-disc list-inside">
                        {doc.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                      <p className="mt-2 italic">
                        Reason: {doc.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-3">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Additional Notes
                </h4>
                <ul className="list-disc list-inside text-yellow-700">
                  {aiRecommendations.additionalNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormAnalyser;