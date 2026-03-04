import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   useLocation,
} from 'react-router-dom';

import Sidebar from './components/ui/Sidebar';
import Loading from './components/ui/Loading';

import { useAuth, AuthProvider } from './context/AuthContext';
import { CareProvider } from './context/CareContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import HealthRecord from './pages/HealthRecord';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppLayout() {
   const location = useLocation();
   const { isAuthenticated, isAuthLoading } = useAuth();
   const hideSidebar =
      location.pathname === '/login' || location.pathname === '/signup';

   if (isAuthLoading) {
      return <Loading />;
   }

   if (!hideSidebar && isAuthenticated) {
      return (
         <div className="flex min-h-screen bg-slate-100">
            <Sidebar />

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
            <CareProvider>
               <AppLayout />
            </CareProvider>
         </AuthProvider>
      </BrowserRouter>
   );
}
