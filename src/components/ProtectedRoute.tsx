import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
   children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
   const { isAuthenticated, isAuthLoading } = useAuth();

   if (isAuthLoading) {
      return (
         <div className="p-6 text-sm text-slate-600">Checking session....</div>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to={'/login'} replace />;
   }

   return children;
}
