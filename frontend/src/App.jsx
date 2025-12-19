import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AgentDashboard from './pages/AgentDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import PropertyDetail from './pages/PropertyDetail';
import ComparePage from './pages/ComparePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { ToastProvider } from './context/ToastContext';

function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CompareProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/agent" element={<AgentDashboard />} />
                <Route path="/buyer" element={<BuyerDashboard />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/compare" element={<ComparePage />} />
              </Route>
              {/* Auth page tanpa header/footer */}
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </Router>
        </CompareProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
