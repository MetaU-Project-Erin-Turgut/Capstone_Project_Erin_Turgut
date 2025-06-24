import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "./pages/WelcomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import './App.css'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />}/>
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path="/login" element={<LoginPage />}/>


        <Route path="/main" element={<MainPage />}/>


        <Route path="/profile" element={<ProfilePage />}/>
      </Routes>
    </HashRouter>
  )
}

export default App
