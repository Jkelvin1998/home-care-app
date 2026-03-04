import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useCare } from '../../context/CareContext';

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

export default function Sidebar() {
   const location = useLocation();
   const { user, logout } = useAuth();
   const {
      careOwners,
      collaborators,
      selectedCareOwnerId,
      setSelectedCareOwnerId,
      collaboratorEmail,
      setCollaboratorEmail,
      addCollaborator,
      deleteCollaborator,
      careError,
   } = useCare();

   const [isCollapsed, setIsCollapsed] = useState(false);
   const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] =
      useState(false);

   const userInitials = (() => {
      const name = user?.name?.trim();
      if (!name) return 'U';

      return name
         .split(' ')
         .filter(Boolean)
         .slice(0, 2)
         .map((part) => part[0]?.toUpperCase() ?? '')
         .join('');
   })();

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
                     (item.to !== '/' &&
                        location.pathname.startsWith(`${item.to}/`));

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

            <div className="mt-5 border-t border-slate-700 pt-4">
               {!isCollapsed && (
                  <>
                     <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Care Account
                     </p>

                     <select
                        value={selectedCareOwnerId}
                        onChange={(event) =>
                           setSelectedCareOwnerId(event.target.value)
                        }
                        className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-2 text-xs text-white"
                     >
                        {careOwners.map((owner) => (
                           <option value={owner.id} key={owner.id}>
                              {owner.name} (
                              {owner.relationship === 'owner'
                                 ? 'My Account'
                                 : 'Shared'}
                              )
                           </option>
                        ))}
                     </select>

                     {selectedCareOwnerId === user?.id && (
                        <button
                           type="button"
                           onClick={() => setIsCollaboratorModalOpen(true)}
                           className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                           Manage Collaborators
                        </button>
                     )}

                     {careError && (
                        <p className="mt-2 text-xs text-rose-300">
                           {careError}
                        </p>
                     )}
                  </>
               )}
            </div>
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
         </div>

         {isCollaboratorModalOpen &&
            createPortal(
               <div
                  className="fixed inset-0 z-1000 flex items-center justify-center bg-slate-900/60 p-4"
                  onClick={() => setIsCollaboratorModalOpen(false)}
               >
                  <div
                     className="w-full max-w-lg rounded-2xl bg-white p-5 text-slate-900 shadow-2xl"
                     onClick={(event) => event.stopPropagation()}
                  >
                     <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-semibold">
                           Manage Collaborators
                        </h4>
                        <button
                           className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                           onClick={() => setIsCollaboratorModalOpen(false)}
                        >
                           Close
                        </button>
                     </div>

                     <div className="flex gap-2">
                        <input
                           type="email"
                           value={collaboratorEmail}
                           onChange={(event) =>
                              setCollaboratorEmail(event.target.value)
                           }
                           placeholder="Enter collaborator email"
                           className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <button
                           onClick={() => void addCollaborator()}
                           className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                           Add
                        </button>
                     </div>

                     <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                        {collaborators.length === 0 && (
                           <li className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                              No collaborators yet.
                           </li>
                        )}
                        {collaborators.map((item) => (
                           <li
                              key={item.id}
                              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                           >
                              <div>
                                 <p className="text-sm font-medium">
                                    {item.name}
                                 </p>
                                 <p className="text-xs text-slate-500">
                                    {item.email}
                                 </p>
                              </div>
                              <button
                                 onClick={() =>
                                    void deleteCollaborator(item.id)
                                 }
                                 className="rounded-md bg-rose-500 px-2 py-1 text-xs font-semibold text-white"
                              >
                                 Remove
                              </button>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>,
               document.body,
            )}
      </aside>
   );
}
