import { Client, Account, ID } from "appwrite";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  // Initialize the Appwrite client
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite endpoint
    .setProject("670f76cb0008eca9526a"); // Replace with your Appwrite Project ID

  const account = new Account(client);

  // Login Function
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Check if there's an active session
      const session = await account.getSession('current');
      // If there is an active session, log out the user
      if (session) {
        await account.deleteSession('current');
      }
    } catch (error) {
      // Ignore error if no session exists
      if (error.code !== 401) { // 401 means no active session
        console.error("Error checking session:", error);
      }
    }

    // Proceed to log in
    account.createEmailPasswordSession(email, password).then(
      (response) => {
        console.log(response); // Success
        alert("Logged in successfully!");
        localStorage.setItem('session', JSON.stringify(response)); // Store session in localStorage
        navigate('/dashboard'); // Redirect to Dashboard
        setLoading(false);
      },
      (error) => {
        console.log(error); // Failure
        alert("Login failed: " + error.message);
        setLoading(false);
      }
    );
  };

  // Signup Function
  const handleSignup = () => {
    setLoading(true);
    account.create(ID.unique(), email, password).then(
      (response) => {
        console.log(response); // Success
        alert("Account created successfully! Please check your email for verification.");
        setLoading(false);
      },
      (error) => {
        console.log(error); // Failure
        alert("Signup failed: " + error.message);
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Name Field for Signup */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-4 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={isLogin ? handleLogin : handleSignup}
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

