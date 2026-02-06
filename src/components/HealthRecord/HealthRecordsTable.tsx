import type { FamilyMember, Health } from '../../types/health';

import {
   formatTime,
   formatDate,
   getAge,
   getOxygenStatus,
   getPulseStatus,
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
      <table
         border={1}
         cellPadding={8}
         style={{ marginTop: 20, width: '100%' }}
      >
         <thead>
            <tr>
               <th>Member</th>
               <th>Time</th>
               <th>Date</th>
               <th>Temperature</th>
               <th>Oxygen</th>
               <th>Pulse</th>
               <th>Oxygen Status</th>
               <th>Pulse Status</th>
               <th>Symptoms</th>
               <th>Actions</th>
            </tr>
         </thead>

         <tbody>
            {selectedRecords.length === 0 ? (
               <tr>
                  <td colSpan={10}>No health records yet</td>
               </tr>
            ) : (
               selectedRecords.map((record) => {
                  const member = memberMap.get(record.memberId);
                  const age = member ? getAge(member.dateOfBirth) : null;

                  return (
                     <tr key={record.id}>
                        <td>{member?.name ?? 'Unknown'}</td>
                        <td>{formatTime(record.savedAt)}</td>
                        <td>{formatDate(record.savedAt)}</td>
                        <td>{record.temperature}</td>
                        <td>{record.oxygen}</td>
                        <td>{record.pulseRate}</td>
                        <td>{getOxygenStatus(record.oxygen)}</td>
                        <td>{getPulseStatus(age, record.pulseRate)}</td>
                        <td>{record.symptoms?.join(', ') || '-'}</td>
                        <td>
                           <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => onEditRecord(record.id)}>
                                 Edit
                              </button>
                              <button
                                 onClick={() => onDeleteRecord(record.id)}
                                 style={{
                                    backgroundColor: '#fee2e2',
                                    borderColor: '#fecaca',
                                 }}
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
