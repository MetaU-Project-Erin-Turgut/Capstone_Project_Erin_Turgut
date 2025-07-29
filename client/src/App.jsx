import { HashRouter, Routes, Route } from 'react-router-dom';
import WithAuth from './components/WithAuth';
import WelcomePage from "./pages/WelcomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import { LoadingProvider } from './contexts/LoadingContext.jsx';
import { welcomeRoute, signUpRoute, loginRoute, mainPageRoute, profileRoute, searchResultsRoute } from "./utils/NavigationConsts.js";
import './App.css'

function App() {

  const ProtectedMainPage = WithAuth(MainPage);
  const ProtectedProfilePage = WithAuth(ProfilePage); 
  const ProtectedSearchResultsPage = WithAuth(SearchResultsPage);
 
  return (
    <>
      <LoadingProvider>
        <NotificationProvider>
          <HashRouter>
            <Routes>
              <Route path={welcomeRoute} element={<WelcomePage />}/>
              <Route path={signUpRoute} element={<SignUpPage />}/>
              <Route path={loginRoute} element={<LoginPage />}/>
              <Route path={mainPageRoute} element={<ProtectedMainPage />}/>
              <Route path={profileRoute} element={<ProtectedProfilePage />}/>
              <Route path={searchResultsRoute} element={<ProtectedSearchResultsPage />}/>
            </Routes>
          </HashRouter>
        </NotificationProvider>
      </LoadingProvider>
    </>
  )
}

export default App
