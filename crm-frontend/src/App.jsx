// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
//import Login from "./pages/Login";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup1";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Layout from "./components/Layout1";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

import "./App.css";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);

        // Fake delay to simulate setup
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("App initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <div className="app-container">
              <Routes>
                {/* Default route → login */}
                <Route index element={<Navigate to="/login" replace />} />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes with Layout */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Leads />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/contacts"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Contacts />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/deals"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Deals />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Reports />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all → redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>

            {/* Toaster placed globally, works on all pages */}
            <Toaster position="top-right" />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
