import React from 'react'
import Home from "./pages/home"
import RootLayout from "./layout/layout"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from "./pages/signup/signupPage"
import LoginPage from "./pages/login/loginPage"
import MetaversePage from './pages/meta/metaverse';
import SettingsPage from './pages/settings/settingPage';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/home" element={<RootLayout><Home /></RootLayout>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/metaverse" element={<MetaversePage />} /> 
        <Route path="/settings" element={<SettingsPage />} /> 
        <Route path="/" element={<Navigate to="/login" replace />}> </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
