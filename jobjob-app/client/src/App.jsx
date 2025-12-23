import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import SelectionPage from './pages/SelectionPage';
import EmployerPricingPage from './pages/EmployerPricingPage';
import CandidatePricingPage from './pages/CandidatePricingPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/selection" element={<SelectionPage />} />
                <Route path="/pricing/employer" element={<EmployerPricingPage />} />
                <Route path="/pricing/candidate" element={<CandidatePricingPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
