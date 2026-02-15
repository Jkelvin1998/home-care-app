import type { FamilyMember, Health } from '../../types/health';

import {
   formatTime,
   formatDate,
   getAge,
   getOxygenStatusInfo,
   getPulseStatusInfo,
   getStatusBadgeClass,
   getTemperatureStatusInfo,
} from '../../utils/utils';

type HealthRecordsTableProps = {
   records: Health[];
   selectedMemberId: string;
   memberMap: Map<string, FamilyMember>;
   onEditRecord: (recordId: string) => void;
   onDeleteRecord: (recordId: string) => void;
};

export default function HealthRecordsTable({
   records,
   selectedMemberId,
   memberMap,
   onEditRecord,
   onDeleteRecord,
}: HealthRecordsTableProps) {
   const selectedRecords = records.filter(
      (record) => record.memberId === selectedMemberId,
   );

   return (
      <table className="mt-4 w-full border-collapse text-sm">
         <thead>
            <tr className="bg-slate-50 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
               <th className="border border-slate-200 px-3 py-2">Time</th>
               <th className="border border-slate-200 px-3 py-2">Date</th>
               <th className="border border-slate-200 px-3 py-2">
                  Temperature
               </th>
               <th className="border border-slate-200 px-3 py-2">
                  Temperature Status
               </th>

               <th className="border border-slate-200 px-3 py-2">Oxygen</th>
               <th className="border border-slate-200 px-3 py-2">Pulse</th>
               <th className="border border-slate-200 px-3 py-2">
                  Oxygen Status
               </th>
               <th className="border border-slate-200 px-3 py-2">
                  Pulse Status
               </th>
               <th className="border border-slate-200 px-3 py-2">Symptoms</th>
               <th className="border border-slate-200 px-3 py-2">Actions</th>
            </tr>
         </thead>

         <tbody>
            {selectedRecords.length === 0 ? (
               <tr>
                  <td
                     colSpan={10}
                     className="border border-slate-200 px-3 py-6 text-center text-sm text-slate-500"
                  >
                     No health records yet
                  </td>
               </tr>
            ) : (
               selectedRecords.map((record) => {
                  const member = memberMap.get(record.memberId);
                  const age = member ? getAge(member.dateOfBirth) : null;
                  const temperatureStatus = getTemperatureStatusInfo(
                     record.temperature,
                  );
                  const oxygenStatus = getOxygenStatusInfo(record.oxygen);
                  const pulseStatus = getPulseStatusInfo(age, record.pulseRate);

                  return (
                     <tr key={record.id}>
                        <td className="border border-slate-200 px-3 py-2">
                           {formatTime(record.savedAt)}
                        </td>
                        <td className="border border-slate-200 px-3 py-2">
                           {formatDate(record.savedAt)}
                        </td>
                        <td className="border border-slate-200 px-3 py-2">
                           {record.temperature}
                        </td>
                        <td className="border border-slate-200 px-3 py-2">
                           <span
                              className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(temperatureStatus.level)}`}
                           >
                              {temperatureStatus.label}
                           </span>
                        </td>

                        <td className="border border-slate-200 px-3 py-2">
                           {record.oxygen}
                        </td>

                        <td className="border border-slate-200 px-3 py-2">
                           {record.pulseRate}
                        </td>

                        <td className="border border-slate-200 px-3 py-2">
                           <span
                              className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(oxygenStatus.level)}`}
                           >
                              {oxygenStatus.label}
                           </span>
                        </td>

                        <td className="border border-slate-200 px-3 py-2">
                           <span
                              className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(pulseStatus.level)}`}
                           >
                              {pulseStatus.label}
                           </span>
                        </td>

                        <td className="border border-slate-200 px-3 py-2">
                           {record.symptoms?.join(', ') || '-'}
                        </td>
                        <td className="border border-slate-200 px-3 py-2">
                           <div className="flex gap-2">
                              <button
                                 onClick={() => onEditRecord(record.id)}
                                 className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => onDeleteRecord(record.id)}
                                 className="rounded-lg border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700"
                              >
                                 Delete
                              </button>
                           </div>
                        </td>
                     </tr>
                  );
               })
            )}
         </tbody>
      </table>
   );
}
