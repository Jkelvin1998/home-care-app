import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   useLocation,
} from 'react-router-dom';

import Navbar from './components/ui/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import { useAuth, AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import HealthRecord from './pages/HealthRecord';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppLayout() {
   const location = useLocation();
   const { isAuthenticated } = useAuth();
   const hideNavbar =
      location.pathname === '/login' || location.pathname === '/signup';

   return (
      <>
         {!hideNavbar && isAuthenticated && <Navbar />}

         <Routes>
            <Route
               path="/login"
               element={
                  isAuthenticated ? <Navigate to={'/'} replace /> : <Login />
               }
            />
            <Route
               path="/signup"
               element={
                  isAuthenticated ? <Navigate to={'/'} replace /> : <Signup />
               }
            />

            <Route
               path="/"
               element={
                  <ProtectedRoute>
                     <Dashboard />
                  </ProtectedRoute>
               }
            />

            <Route
               path="/inventory"
               element={
                  <ProtectedRoute>
                     <Inventory />
                  </ProtectedRoute>
               }
            />

            <Route
               path="/health-record"
               element={
                  <ProtectedRoute>
                     <HealthRecord />
                  </ProtectedRoute>
               }
            />

            <Route path="*" element={<Navigate to={'/'} replace />} />
         </Routes>
      </>
   );
}

export default function App() {
   return (
      <BrowserRouter>
         <AuthProvider>
            <AppLayout />
         </AuthProvider>
      </BrowserRouter>
   );
}
