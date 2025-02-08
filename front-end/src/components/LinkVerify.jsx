import React, { useState } from "react";
import axios from "axios";

const LinkVerify = () => {
  const [url, setUrl] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleVerifyUrl = async (e) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/verify-link", {
        url: url,
      });

      setVerificationResult(response.data.result);
    } catch (err) {
      setError("Error verifying the URL.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">URL Verifier</h1>
        <form onSubmit={handleVerifyUrl}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="url">
              Enter URL to Verify
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              placeholder="https://example.com"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify URL"}
          </button>
        </form>
        {verificationResult && (
          <div className="mt-6 text-center">
            <p className={`text-lg font-semibold ${verificationResult === "original" ? "text-green-600" : "text-red-600"}`}>
              {verificationResult === "original" ? "This URL is legitimate." : "This URL is fraudulent."}
            </p>
          </div>
        )}
        {error && (
          <div className="mt-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default LinkVerify;
