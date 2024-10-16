import { useLocation } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const analysisResult = location.state; // Get the data passed from the Dashboard

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>

        {analysisResult ? (
          <>
            <p><strong>Job Recommendations:</strong> {analysisResult.recommendations}</p>
            <p><strong>ATS Score:</strong> {analysisResult.ats_score}</p>
            <p><strong>Suggestions:</strong> {analysisResult.suggestions}</p>

            {/* Add more fields as necessary based on your API response */}
          </>
        ) : (
          <p>No results available.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;

