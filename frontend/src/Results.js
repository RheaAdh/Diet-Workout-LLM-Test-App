import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import loaderGif from './loader.gif'

const Results = () => {
    const location = useLocation();
    const { formData } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/generate_plan/', formData);
          setData(response.data);
        } catch (err) {
          setError(err.response ? err.response.data.detail : 'Error generating plan');
        } finally {
          setLoading(false);
        }
      };
      if (formData) {
        fetchData();
      }
    }, [formData]);

    return (
      <div className="page-container">
        {loading && (
          <div className="loader-container">
            <img src={loaderGif} alt="Loading..." className="loader-gif" />
            <p className="loading-text">Generating your personalized health plan, please wait...</p>
          </div>
        )}
        {error && <p className="error-text">{error}</p>}
        {data && (
          <div className="response-container">
            <h3 className="response-header">Your Generated Plan:</h3>
            <div>
              <p><strong>BMI:</strong> {data.BMI}</p>
              <h4>Diet Plan</h4>
              <p>{data['Diet Plan']}</p>
              <h4>Workout Plan</h4>
              <p>{data['Workout Plan']}</p>
            </div>
          </div>
        )}
      </div>
    );
};

export default Results;
