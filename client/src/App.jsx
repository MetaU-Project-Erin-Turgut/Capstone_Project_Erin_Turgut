import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useUser } from "./contexts/UserContext";
import WelcomePage from "./pages/WelcomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import './App.css'

function App() {

  const { setUser } = useUser();

  // useEffect(() => {
  //   //check if session exists when the app starts
  //   fetch("http://localhost:3000/me", { credentials: "include" })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.id) {
  //         setUser(data); // Set the user in context
  //       }
  //     });
  // }, [setUser]); //need this dependency?


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
