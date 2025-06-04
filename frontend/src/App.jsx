import React from 'react'
import Home from "./pages/home"
import './index.css'
import RootLayout from "./layout/layout"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from "./pages/signup/signupPage"
import LoginPage from "./pages/login/loginPage"
import MetaversePage from './pages/meta/metaverse';
import SettingsPage from './pages/settings/settingPage';
import PhaserGame from './pages/meta/phaserGame';
function App() {
 //no one can open inspect tab
 
   React.useEffect(() => {
    const handleKeyDown = (e) => {
      // F12, Ctrl+Shift+I/J/C, Ctrl+U
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  const [roomId, setRoomId] = React.useState("");
  return (
    <>
    <Router>
      <Routes>
        <Route path="/home" element={<RootLayout><Home /></RootLayout>} />
        <Route path="/signup" element={<RootLayout><SignupPage></SignupPage></RootLayout>} />
        <Route path="/login" element={<RootLayout><LoginPage  ></LoginPage></RootLayout>} />
        <Route path="/metaverse" element={<RootLayout><MetaversePage setRoomId={setRoomId}></MetaversePage></RootLayout>} /> 
        <Route path="/settings" element={<RootLayout><SettingsPage ></SettingsPage></RootLayout>} /> 
        <Route path="/game" element={<RootLayout><PhaserGame roomId={roomId} /></RootLayout>} /> 
        <Route path="/" element={<Navigate to="/home" replace />}> </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
