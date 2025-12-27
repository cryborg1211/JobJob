import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SelectionPage from './pages/SelectionPage';
import EmployerPricingPage from './pages/EmployerPricingPage';
import CandidatePricingPage from './pages/CandidatePricingPage';
import DashboardPage from './pages/DashboardPage';
import SwipePage from './pages/SwipePage';
import ProfilePage from './pages/ProfilePage';
import MatchesPage from './pages/MatchesPage';
import JobManagePage from './pages/JobManagePage';
import CreateJobPage from './pages/CreateJobPage';
import EditJobPage from './pages/EditJobPage';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/selection" element={<SelectionPage />} />
                    <Route path="/pricing/employer" element={<EmployerPricingPage />} />
                    <Route path="/pricing/candidate" element={<CandidatePricingPage />} />

                    {/* Protected routes - any authenticated user */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/swipe" element={
                        <ProtectedRoute>
                            <SwipePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/matches" element={
                        <ProtectedRoute>
                            <MatchesPage />
                        </ProtectedRoute>
                    } />

                    {/* Employer only routes */}
                    <Route path="/jobs/manage" element={
                        <ProtectedRoute requiredRole="employer">
                            <JobManagePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/jobs/create" element={
                        <ProtectedRoute requiredRole="employer">
                            <CreateJobPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/jobs/edit/:id" element={
                        <ProtectedRoute requiredRole="employer">
                            <EditJobPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
