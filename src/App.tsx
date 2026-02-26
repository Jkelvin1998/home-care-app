import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   useLocation,
} from 'react-router-dom';

import Navbar from './components/ui/Navbar';
import Loading from './components/ui/Loading';

import { useAuth, AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import HealthRecord from './pages/HealthRecord';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppLayout() {
   const location = useLocation();
   const { isAuthenticated, isAuthLoading } = useAuth();
   const hideNavbar =
      location.pathname === '/login' || location.pathname === '/signup';

   if (isAuthLoading) {
      return <Loading />;
   }

   if (!hideNavbar && isAuthenticated) {
      return (
         <div className="flex min-h-screen bg-slate-100">
            <Navbar />

            <main className="flex-1 p-4 md:p-6">
               <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/health-record" element={<HealthRecord />} />
                  <Route path="*" element={<Navigate to={'/'} replace />} />
               </Routes>
            </main>
         </div>
      );
   }

   return (
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

         <Route path="*" element={<Navigate to={'/login'} replace />} />
      </Routes>
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
