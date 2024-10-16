import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // Define state variables
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const resumeText = event.target.result;

        setProcessing(true);

        try {
          // Make direct call to OpenAI API using environment variable for the key
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,  // Using environment variable
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo-0125',  // Corrected model name
              messages: [
                { role: 'system', content: 'You are a helpful assistant that analyzes resumes.' },
                { role: 'user', content: `Analyze this resume and provide job recommendations: ${resumeText}` },
              ],
              max_tokens: 500,
              temperature: 0.7,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json(); // Capture error details from response body
            throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}: ${errorData.error.message}`);
          }

          const data = await response.json();
          setAnalysisResult(data.choices[0].message.content);
          navigate('/results', { state: data.choices[0].message.content });
        } catch (error) {
          console.error("OpenAI API call failed:", error);
          alert(`OpenAI API call failed: ${error.message}`);
        } finally {
          setProcessing(false);
        }
      };

      reader.readAsText(file);
      alert("File read successfully!");
    } catch (error) {
      console.error("File processing failed:", error);
      alert(`File processing failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>

        {/* Form to upload resume */}
        <form onSubmit={handleFileUpload}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </form>

        {/* Loading Indicator */}
        {processing && <div className="mt-4 text-center">Processing... Please wait.</div>}
      </div>
    </div>
  );
};

export default Dashboard;

