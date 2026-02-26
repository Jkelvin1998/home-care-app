import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './ui/Loading';

type ProtectedRouteProps = {
   children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
   const { isAuthenticated, isAuthLoading } = useAuth();

   if (isAuthLoading) {
      return <Loading />;
   }

   if (!isAuthenticated) {
      return <Navigate to={'/login'} replace />;
   }

   return children;
}
