import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   useLocation,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Sidebar from './components/ui/Sidebar';
import TopNavbar from './components/ui/TopNavbar';
import Loading from './components/ui/Loading';

import { useAuth, AuthProvider } from './context/AuthContext';
import { CareProvider } from './context/CareContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const HealthRecord = lazy(() => import('./pages/HealthRecord'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

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

            <div className="flex min-w-0 flex-1 flex-col">
               <TopNavbar />

               <main className="flex-1 p-4 md:p-6">
                  <Suspense fallback={<Loading />}>
                     <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route
                           path="/health-record"
                           element={<HealthRecord />}
                        />
                        <Route
                           path="*"
                           element={<Navigate to={'/'} replace />}
                        />
                     </Routes>
                  </Suspense>
               </main>
            </div>
         </div>
      );
   }

   return (
      <Suspense fallback={<Loading />}>
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
      </Suspense>
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
