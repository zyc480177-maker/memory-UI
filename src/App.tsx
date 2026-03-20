/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Sidebar, MobileNav } from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Archive from './pages/Archive';
import Timeline from './pages/Timeline';
import Refinement from './pages/Refinement';
import Preview from './pages/Preview';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Analytics from './pages/Analytics';
import QuickActions from './pages/QuickActions';
import Notifications from './pages/Notifications';
import BiographyBook from './pages/BiographyBook';
import Writing from './pages/Writing';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isOnboardingPage = location.pathname === '/onboarding';
  const isAuthFlow = isLoginPage || isOnboardingPage;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
      {!isAuthFlow && <Navbar />}
      {!isAuthFlow && <Sidebar />}
      <main className={`${!isAuthFlow ? 'pt-16' : ''} transition-all duration-500`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/quick-actions" element={<QuickActions />} />
          <Route path="/refinement" element={<Refinement />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/biography-book" element={<BiographyBook />} />
          <Route path="/writing" element={<Writing />} />
        </Routes>
      </main>
      {!isAuthFlow && <MobileNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

