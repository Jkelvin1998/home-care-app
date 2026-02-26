import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { MdDashboard } from 'react-icons/md';
import { MdInventory } from 'react-icons/md';
import { RiHealthBookLine } from 'react-icons/ri';
import { IoMenu } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';

const navigationItems = [
   { label: 'Dashboard', icon: MdDashboard, to: '/' },
   { label: 'Inventory', icon: MdInventory, to: '/inventory' },
   { label: 'Health Records', icon: RiHealthBookLine, to: '/health-record' },
];

export default function Navbar() {
   const location = useLocation();
   const { user, logout } = useAuth();
   const [isCollapsed, setIsCollapsed] = useState(false);

   const userInitials = useMemo(() => {
      if (!user?.name) return 'U';

      return user.name
         .split(' ')
         .filter(Boolean)
         .slice(0, 2)
         .map((namePart) => namePart[0]?.toUpperCase() ?? '')
         .join('');
   }, [user?.name]);

   return (
      <aside
         className={`sticky top-0 flex h-screen flex-col justify-between overflow-hidden bg-slate-900 px-3 py-4 text-white transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
         <div>
            <button
               type="button"
               onClick={() => setIsCollapsed((prev) => !prev)}
               className="mb-6 flex w-full items-center rounded-md bg-slate-800 px-3 py-2 text-left text-sm font-semibold hover:bg-slate-700"
               aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
               <span className="w-5 shrink-0 text-center text-lg">
                  <IoMenu className="text-2xl font-extrabold" />
               </span>
               <span
                  className={`ml-3 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-24 translate-x-0 opacity-100'}`}
               >
                  Menu
               </span>
            </button>
         </div>

         <div>
            <nav className="space-y-2">
               {navigationItems.map((item) => {
                  const isActive =
                     location.pathname === item.to ||
                     (item.to !== '/' && location.pathname.startsWith(item.to));

                  return (
                     <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-800'}`}
                     >
                        <span className="w-5 shrink-0 text-center">
                           <item.icon className="text-2xl font-extrabold" />
                        </span>
                        <span
                           className={`ml-3 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-40 translate-x-0 opacity-100'}`}
                        >
                           {item.label}
                        </span>
                     </Link>
                  );
               })}
            </nav>
         </div>

         <div className="border-t border-slate-700 pt-4">
            <div className="mb-3 flex items-center gap-3 overflow-hidden">
               {user?.profilePicture ? (
                  <img
                     src={user.profilePicture}
                     alt={user.name}
                     className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
               ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                     {userInitials}
                  </div>
               )}

               <div
                  className={`min-w-0 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-48 translate-x-0 opacity-100'}`}
               >
                  <p className="truncate text-sm font-semibold text-white">
                     {user?.name ?? 'User'}
                  </p>
                  <p className="truncate text-xs text-slate-300">
                     {user?.email ?? ''}
                  </p>
               </div>
            </div>

            <button
               type="button"
               onClick={logout}
               className="flex w-full items-center rounded-md bg-slate-800 px-3 py-2 text-left text-sm font-semibold hover:bg-slate-700"
            >
               <span className="w-5 shrink-0 text-center text-lg">
                  <MdLogout className="text-2xl" />
               </span>
               <span
                  className={`ml-3 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-24 translate-x-0 opacity-100'}`}
               >
                  Logout
               </span>
            </button>
            {/* <button
               type="button"
               onClick={logout}
               className="w-full rounded-md border border-white/30 px-3 py-2 text-sm font-semibold hover:border-white"
            >
               {isCollapsed ? (
                  <>
                     <MdLogout className="text-2xl" />
                  </>
               ) : (
                  'Logout'
               )}
            </button> */}
         </div>
      </aside>
   );
}
