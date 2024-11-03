import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Home = () => {
    return (
        <div className="page-container">
            <h1 className="header">Health Plan Generator</h1>
            <Link to="/generate" className="link-button">Generate Plan</Link>
        </div>
    );
};

export default Home;
