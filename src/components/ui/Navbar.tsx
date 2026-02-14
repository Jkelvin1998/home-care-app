import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
   const { logout } = useAuth();

   return (
      <nav className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-6 py-4 text-sm font-semibold text-white">
         <div className="flex flex-wrap items-center gap-4">
            <Link to={'/'} className="hover:text-blue-200">
               Dashboard
            </Link>
            <Link to={'/inventory'} className="hover:text-blue-200">
               Inventory
            </Link>
            <Link to={'/health-record'} className="hover:text-blue-200">
               Health
            </Link>
         </div>

         <div className="flex items-center gap-3">
            <button
               type="button"
               onClick={logout}
               className="rounded-full border border-white/30 px-3 py-1 hover:border-white"
            >
               Logout
            </button>
         </div>
      </nav>
   );
}
