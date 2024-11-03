import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Results from './pages/Results';
import Home from './pages/Home';
import GeneratePlan from './pages/GeneratePlan';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generate" element={<GeneratePlan />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </Router>
    );
};

export default App;
