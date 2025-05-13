import React from 'react'
import Home from "./pages/home"
import './index.css'
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
        <Route path="/signup" element={<RootLayout><SignupPage></SignupPage></RootLayout>} />
        <Route path="/login" element={<RootLayout><LoginPage></LoginPage></RootLayout>} />
        <Route path="/metaverse" element={<RootLayout><MetaversePage></MetaversePage></RootLayout>} /> 
        <Route path="/settings" element={<RootLayout><SettingsPage></SettingsPage></RootLayout>} /> 
        <Route path="/" element={<Navigate to="/home" replace />}> </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
