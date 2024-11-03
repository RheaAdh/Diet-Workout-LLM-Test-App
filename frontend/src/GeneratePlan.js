import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/results', { state: { formData } });
    };

    return (
        <div className="page-container">
            <h2 className="header">Generate Your Diet and Workout Plan</h2>
            <form onSubmit={handleSubmit} className="form">
                <input type="number" name="age" placeholder="Age" onChange={handleChange} className="input" required />
                <input type="text" name="gender" placeholder="Gender" onChange={handleChange} className="input" required />
                <input type="number" name="height_feet" placeholder="Height (Feet)" onChange={handleChange} className="input" required />
                <input type="number" name="height_inches" placeholder="Height (Inches)" onChange={handleChange} className="input" required />
                <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} className="input" required />
                <input type="number" name="workout_days" placeholder="Workout Days per Week" onChange={handleChange} className="input" required />
                <input type="text" name="diet_type" placeholder="Diet Type (Veg/Non-Veg)" onChange={handleChange} className="input" required />
                <input type="text" name="dietary_restrictions" placeholder="Dietary Restrictions (if any)" onChange={handleChange} className="input" />
                <button type="submit" className="submit-button">Generate Plan</button>
            </form>
        </div>
    );
};

export default GeneratePlan;
