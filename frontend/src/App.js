import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  return (
    <div>
      <h1>Health Plan Generator</h1>
      <Link to="/generate">Generate Plan</Link>
    </div>
  );
};

const GeneratePlan = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height_feet: '',
    height_inches: '',
    weight: '',
    workout_days: '',
    diet_type: '',
    dietary_restrictions: ''
  });
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponseData(null); // Clear previous response
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://127.0.0.1:8000/generate_plan/', formData);
      setResponseData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.detail : 'Error generating plan');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Generate Your Diet and Workout Plan</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" onChange={handleChange} required />
        <input type="number" name="height_feet" placeholder="Height (Feet)" onChange={handleChange} required />
        <input type="number" name="height_inches" placeholder="Height (Inches)" onChange={handleChange} required />
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
        <input type="number" name="workout_days" placeholder="Workout Days per Week" onChange={handleChange} required />
        <input type="text" name="diet_type" placeholder="Diet Type (Veg/Non-Veg)" onChange={handleChange} required />
        <input type="text" name="dietary_restrictions" placeholder="Dietary Restrictions (if any)" onChange={handleChange} />
        <button type="submit">Generate Plan</button>
      </form>

      {loading && <p>Loading...</p>} {/* Loader message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseData && (
        <div>
          <h3>Your Generated Plan:</h3>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <p><strong>BMI:</strong> {responseData.BMI}</p>
            <h4>Diet Plan</h4>
            <p>{responseData['Diet Plan']}</p>
            <h4>Workout Plan</h4>
            <p>{responseData['Workout Plan']}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<GeneratePlan />} />
      </Routes>
    </Router>
  );
};

export default App;
