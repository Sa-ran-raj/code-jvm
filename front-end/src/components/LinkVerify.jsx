import React, { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const LinkVerify = () => {
  const [url, setUrl] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const commonPhishingKeywords = [
    "login", "signin", "verify", "account", "secure", "update", "password",
    "confirm", "banking", "security", "authenticate", "wallet"
  ];

  const legitDomains = [
    "google.com", "facebook.com", "microsoft.com", "apple.com", "amazon.com",
    "twitter.com", "instagram.com", "linkedin.com", "github.com"
  ];

  const checkUrl = (inputUrl) => {
    const checks = [];
    let isValid = true;

    try {
      // Create URL object to parse the input
      const urlObject = new URL(inputUrl);
      
      // Check 1: Valid URL structure
      checks.push({
        passed: true,
        message: "Valid URL structure"
      });

      // Check 2: Protocol check
      const hasSecureProtocol = urlObject.protocol === "https:";
      checks.push({
        passed: hasSecureProtocol,
        message: hasSecureProtocol ? 
          "Uses secure HTTPS protocol" : 
          "Warning: Not using HTTPS protocol"
      });
      if (!hasSecureProtocol) isValid = false;

      // Check 3: Domain analysis
      const domain = urlObject.hostname.toLowerCase();
      
      // Check for IP address URLs
      const isIpAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain);
      checks.push({
        passed: !isIpAddress,
        message: isIpAddress ? 
          "Warning: IP address detected instead of domain name" : 
          "Uses proper domain name"
      });
      if (isIpAddress) isValid = false;

      // Check 4: Suspicious characters
      const hasSuspiciousChars = /[@%\\/]/.test(inputUrl);
      checks.push({
        passed: !hasSuspiciousChars,
        message: hasSuspiciousChars ? 
          "Warning: Contains suspicious characters" : 
          "No suspicious characters detected"
      });
      if (hasSuspiciousChars) isValid = false;

      // Check 5: Phishing keywords in URL
      const hasPhishingKeywords = commonPhishingKeywords.some(keyword => 
        inputUrl.toLowerCase().includes(keyword)
      );
      checks.push({
        passed: !hasPhishingKeywords,
        message: hasPhishingKeywords ? 
          "Warning: Contains common phishing keywords" : 
          "No suspicious keywords detected"
      });
      if (hasPhishingKeywords) isValid = false;

      // Check 6: Domain spoofing
      const isDomainSpoofed = legitDomains.some(legitDomain => {
        const similar = domain.includes(legitDomain.replace(".com", "")) && 
                       domain !== legitDomain;
        return similar;
      });
      checks.push({
        passed: !isDomainSpoofed,
        message: isDomainSpoofed ? 
          "Warning: Possible domain spoofing detected" : 
          "No domain spoofing detected"
      });
      if (isDomainSpoofed) isValid = false;

      // Check 7: Excessive subdomains
      const subdomainCount = domain.split(".").length - 2;
      const hasExcessiveSubdomains = subdomainCount > 3;
      checks.push({
        passed: !hasExcessiveSubdomains,
        message: hasExcessiveSubdomains ? 
          "Warning: Excessive number of subdomains" : 
          "Normal subdomain structure"
      });
      if (hasExcessiveSubdomains) isValid = false;

      return { isValid, checks };
    } catch (error) {
      return {
        isValid: false,
        checks: [{
          passed: false,
          message: "Invalid URL format"
        }]
      };
    }
  };

  const handleVerifyUrl = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate async operation for better UX
    setTimeout(() => {
      const result = checkUrl(url);
      setVerificationResult(result.isValid);
      setDetails(result.checks);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          URL Verifier
        </h1>
        
        <form onSubmit={handleVerifyUrl}>
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-semibold mb-2" 
              htmlFor="url"
            >
              Enter URL to Verify
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              placeholder="https://example.com"
              required
            />
          </div>
          
          <button
            type="submit"
            className={`w-full p-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify URL"}
          </button>
        </form>

        {verificationResult !== null && !isLoading && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              {verificationResult ? (
                <>
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-lg font-semibold text-green-600">
                    URL appears to be legitimate
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" size={24} />
                  <span className="text-lg font-semibold text-red-600">
                    URL may be suspicious
                  </span>
                </>
              )}
            </div>

            <div className="space-y-2">
              {details.map((detail, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded ${
                    detail.passed ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {detail.passed ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertTriangle className="text-red-500" size={16} />
                  )}
                  <span className={detail.passed ? "text-green-700" : "text-red-700"}>
                    {detail.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkVerify;