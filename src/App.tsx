/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, MobileNav } from './components/Navigation';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Archive from './pages/Archive';
import Timeline from './pages/Timeline';
import Preview from './pages/Preview';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Writing from './pages/Writing';
import Capture from './pages/Capture';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-4">sync</span>
          <p className="text-on-surface-variant">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isOnboardingPage = location.pathname === '/onboarding';
  const isAuthFlow = isLoginPage || isOnboardingPage;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
      {!isAuthFlow && <Navbar />}
      <main className={`${!isAuthFlow ? 'pt-16' : ''} transition-all duration-500`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/archive" element={<RequireAuth><Archive /></RequireAuth>} />
          <Route path="/timeline" element={<RequireAuth><Timeline /></RequireAuth>} />
          <Route path="/writing" element={<RequireAuth><Writing /></RequireAuth>} />
          <Route path="/capture" element={<RequireAuth><Capture /></RequireAuth>} />
          <Route path="/preview" element={<RequireAuth><Preview /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        </Routes>
      </main>
      {!isAuthFlow && <MobileNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}
