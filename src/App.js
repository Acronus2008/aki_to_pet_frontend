import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import { PremiumProvider } from './contexts/PremiumContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Pets from './pages/Pets';
import PetDetail from './pages/PetDetail';
import AddPet from './pages/AddPet';
import Premium from './pages/Premium';
import Partners from './pages/Partners';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Styles
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PetProvider>
          <PremiumProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/partners" element={<Partners />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/pets" element={
                    <ProtectedRoute>
                      <Pets />
                    </ProtectedRoute>
                  } />
                  <Route path="/pets/add" element={
                    <ProtectedRoute>
                      <AddPet />
                    </ProtectedRoute>
                  } />
                  <Route path="/pets/:id" element={
                    <ProtectedRoute>
                      <PetDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/premium" element={
                    <ProtectedRoute>
                      <Premium />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </PremiumProvider>
        </PetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
