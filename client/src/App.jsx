import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useUser } from "./contexts/UserContext";
import WithAuth from './components/WithAuth';
import WelcomePage from "./pages/WelcomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import { welcomeRoute, signUpRoute, loginRoute, mainPageRoute, profileRoute } from "./utils/NavigationConsts.js";
import './App.css'

function App() {

  const ProtectedMainPage = WithAuth(MainPage);
  const ProtectedProfilePage = WithAuth(ProfilePage); 

  return (
    <HashRouter>
      <Routes>
        <Route path={welcomeRoute} element={<WelcomePage />}/>
        <Route path={signUpRoute} element={<SignUpPage />}/>
        <Route path={loginRoute} element={<LoginPage />}/>


        <Route path={mainPageRoute} element={<ProtectedMainPage />}/>


        <Route path={profileRoute} element={<ProtectedProfilePage />}/>
      </Routes>
    </HashRouter>
  )
}

export default App
