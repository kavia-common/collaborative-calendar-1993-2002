import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { CalendarProvider } from './contexts/CalendarContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPanel from './components/SettingsPanel';

// PUBLIC_INTERFACE
export default function App() {
  /** Root application component configuring routes, providers, and the light theme. */
  return (
    <div className="App theme-light">
      <AuthProvider>
        <CalendarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <CalendarPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <div className="app-shell">
                      <SettingsPanel />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CalendarProvider>
      </AuthProvider>
    </div>
  );
}
