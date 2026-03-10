import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { apiRequest } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useCare } from '../../context/CareContext';
import type { HealthRecordHistory } from '../../types/health';

import { MdManageAccounts } from 'react-icons/md';
import { MdManageHistory } from 'react-icons/md';

import Logo from '../../assets/logo-dark.png';

const RECENT_ACTIVITY_LIMIT = 25;

function formatActivityDateLabel(dateValue: string) {
   const date = new Date(dateValue);
   const today = new Date();
   const yesterday = new Date();
   yesterday.setDate(today.getDate() - 1);

   const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

   if (isSameDay(date, today)) return 'Today';
   if (isSameDay(date, yesterday)) return 'Yesterday';

   return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
   });
}

function groupHistoryByDay(entries: HealthRecordHistory[]) {
   return entries.reduce<
      Array<{ heading: string; items: HealthRecordHistory[] }>
   >((groups, entry) => {
      const heading = formatActivityDateLabel(entry.changedAt);
      const lastGroup = groups[groups.length - 1];

      if (!lastGroup || lastGroup.heading !== heading) {
         groups.push({ heading, items: [entry] });
         return groups;
      }

      lastGroup.items.push(entry);
      return groups;
   }, []);
}

export default function TopNavbar() {
   const { user } = useAuth();
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

   const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] =
      useState(false);

   const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
   const [activityHistory, setActivityHistory] = useState<
      HealthRecordHistory[]
   >([]);
   const [historyError, setHistoryError] = useState('');
   const [isHistoryLoading, setIsHistoryLoading] = useState(false);

   useEffect(() => {
      if (!isCollaboratorModalOpen) return;

      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') setIsCollaboratorModalOpen(false);
      };

      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
   }, [isCollaboratorModalOpen]);

   useEffect(() => {
      if (!isHistoryPanelOpen) return;

      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') setIsHistoryPanelOpen(false);
      };

      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
   }, [isHistoryPanelOpen]);

   useEffect(() => {
      let cancelled = false;

      if (!selectedCareOwnerId || !isHistoryPanelOpen) {
         return;
      }

      const loadActivityHistory = async () => {
         setIsHistoryLoading(true);

         try {
            const params = new URLSearchParams({
               careOwnerId: selectedCareOwnerId,
               limit: String(RECENT_ACTIVITY_LIMIT),
            });

            const history = await apiRequest<HealthRecordHistory[]>(
               `/records/history?${params.toString()}`,
               {
                  auth: true,
               },
            );

            if (cancelled) return;

            setActivityHistory(history);
            setHistoryError('');
         } catch (err) {
            if (cancelled) return;

            setActivityHistory([]);
            setHistoryError(
               err instanceof Error
                  ? err.message
                  : 'Failed to load activity history',
            );
         } finally {
            if (!cancelled) setIsHistoryLoading(false);
         }
      };

      void loadActivityHistory();

      return () => {
         cancelled = true;
      };
   }, [isHistoryPanelOpen, selectedCareOwnerId]);

   return (
      <>
         <header className="sticky top-0 z-30 mr-2 rounded-b-xl border-b border-slate-200 bg-slate-900 px-4 py-3 shadow-sm md:px-6">
            <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
               <div className="justify-self-start">
                  <div className="flex items-center overflow-hidden rounded-md">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white">
                        <img
                           src={Logo}
                           alt="Home Care App Logo"
                           className="h-8 w-8 object-contain"
                        />
                     </div>
                     <span className="ml-3 whitespace-nowrap text-sm font-semibold text-white">
                        Home Care App
                     </span>
                  </div>
               </div>

               <div className="flex flex-col gap-2 sm:flex-row sm:items-end md:justify-self-center">
                  <label
                     htmlFor="care-account"
                     className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-100 sm:pb-2"
                  >
                     Care Account
                  </label>

                  <select
                     id="care-account"
                     value={selectedCareOwnerId}
                     onChange={(event) =>
                        setSelectedCareOwnerId(event.target.value)
                     }
                     className="h-10 w-full min-w-60 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900"
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
               </div>

               <div className="flex items-center gap-2 md:justify-self-end">
                  {selectedCareOwnerId === user?.id && (
                     <button
                        type="button"
                        onClick={() => setIsCollaboratorModalOpen(true)}
                        className="inline-flex h-10 min-w-49 items-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700"
                     >
                        <MdManageAccounts className="h-6 w-6" />
                        Manage Collaborators
                     </button>
                  )}

                  <button
                     type="button"
                     onClick={() => setIsHistoryPanelOpen(true)}
                     className="inline-flex h-10 min-w-40 items-center gap-2 whitespace-nowrap rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                     <MdManageHistory className="h-6 w-6" />
                     Activity History
                  </button>
               </div>
            </div>

            {careError && (
               <p className="mt-2 text-sm text-rose-600">{careError}</p>
            )}
         </header>

         {isCollaboratorModalOpen &&
            createPortal(
               <div
                  className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="collaborator-modal-title"
                  onClick={() => setIsCollaboratorModalOpen(false)}
               >
                  <div
                     className="w-full max-w-lg rounded-2xl bg-white p-5 text-slate-900 shadow-2xl"
                     onClick={(event) => event.stopPropagation()}
                  >
                     <div className="mb-4 flex items-center justify-between">
                        <h4
                           id="collaborator-modal-title"
                           className="text-lg font-semibold"
                        >
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

         {isHistoryPanelOpen &&
            createPortal(
               <div
                  className="fixed inset-0 z-[1000] bg-slate-900/40"
                  onClick={() => setIsHistoryPanelOpen(false)}
               >
                  <aside
                     className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl"
                     role="dialog"
                     aria-modal="true"
                     aria-labelledby="activity-history-title"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className="mb-4 flex items-center justify-between">
                        <h3
                           id="activity-history-title"
                           className="text-lg font-semibold text-slate-900"
                        >
                           Activity History
                        </h3>

                        <button
                           type="button"
                           onClick={() => setIsHistoryPanelOpen(false)}
                           className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                        >
                           Close
                        </button>
                     </div>

                     <p className="text-sm text-slate-500">
                        Showing the most recent {RECENT_ACTIVITY_LIMIT} actions
                        to keep this panel fast and readable.
                     </p>

                     {isHistoryLoading ? (
                        <p className="mt-4 rounded-lg border border-slate-200 p-3 text-sm text-slate-600">
                           Loading history...
                        </p>
                     ) : historyError ? (
                        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                           {historyError}
                        </p>
                     ) : activityHistory.length === 0 ? (
                        <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                           No activity history yet.
                        </p>
                     ) : (
                        <div className="mt-4 space-y-4">
                           {groupHistoryByDay(activityHistory).map((group) => (
                              <section key={group.heading}>
                                 <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {group.heading}
                                 </h4>

                                 <ul className="space-y-3">
                                    {group.items.map((entry) => (
                                       <li
                                          key={entry.id}
                                          className="rounded-lg border border-slate-200 p-3"
                                       >
                                          <p className="text-sm font-semibold text-slate-800">
                                             {entry.actorName} {entry.action} a
                                             record.
                                          </p>
                                          <p className="mt-1 text-xs text-slate-500">
                                             {new Date(
                                                entry.changedAt,
                                             ).toLocaleString()}
                                             {''}• Temp{' '}
                                             {entry.snapshot.temperature} °C •
                                             O₂{''}
                                             {entry.snapshot.oxygen}% • Pulse{' '}
                                             {entry.snapshot.pulseRate} bpm
                                          </p>
                                       </li>
                                    ))}
                                 </ul>
                              </section>
                           ))}
                        </div>
                     )}
                  </aside>
               </div>,
               document.body,
            )}
      </>
   );
}
