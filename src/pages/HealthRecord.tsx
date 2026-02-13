import { useEffect, useMemo, useState } from 'react';

import { apiRequest } from '../lib/api';

import type { FamilyMember, Health } from '../types/health';

import HealthMetricsForm from '../components/HealthRecord/HealthMetricsForm';
import HealthRecordsTable from '../components/HealthRecord/HealthRecordsTable';
import MemberForm from '../components/HealthRecord/MemberForm';
import MemberProfileCard from '../components/HealthRecord/MemberProfileCard';
import MemberSelector from '../components/HealthRecord/MemberSelector';

export default function HealthRecord() {
   const [records, setRecords] = useState<Health[]>([]);
   const [members, setMembers] = useState<FamilyMember[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   const [temperature, setTemperature] = useState<number>(36.5);
   const [oxygen, setOxygen] = useState<number>(95);
   const [pulseRate, setPulseRate] = useState<number>(50);
   const [symptomsInput, setSymptomsInput] = useState('');
   const [selectedMemberId, setSelectedMemberId] = useState<string>('');
   const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
   const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
   const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
   const [memberName, setMemberName] = useState('');
   const [memberDob, setMemberDob] = useState('');
   const [memberGender, setMemberGender] =
      useState<FamilyMember['gender']>('Female');
   const [memberWeight, setMemberWeight] = useState<number>(60);
   const [memberHeight, setMemberHeight] = useState<number>(165);
   const [memberProfileImage, setMemberProfileImage] = useState('');

   const memberMap = useMemo(() => {
      return new Map(members.map((m) => [m.id, m]));
   }, [members]);

   useEffect(() => {
      const load = async () => {
         setLoading(true);
         setError('');

         try {
            const [membersData, recordsData] = await Promise.all([
               apiRequest<FamilyMember[]>('/members', { auth: true }),
               apiRequest<Health[]>('/records', { auth: true }),
            ]);

            setMembers(membersData);
            setRecords(recordsData);

            if (membersData.length > 0) {
               setSelectedMemberId((prev) => prev || membersData[0].id);
            }
         } catch (err) {
            setError(
               err instanceof Error
                  ? err.message
                  : 'Failed to load health data',
            );
         } finally {
            setLoading(false);
         }
      };

      load();
   }, []);

   const resetMemberForm = () => {
      setMemberName('');
      setMemberDob('');
      setMemberGender('Female');
      setMemberWeight(60);
      setMemberHeight(165);
      setMemberProfileImage('');
      setEditingMemberId(null);
   };

   const openAddMemberForm = () => {
      resetMemberForm();
      setIsMemberFormOpen(true);
   };

   const openEditMemberForm = () => {
      const selectedMember = selectedMemberId
         ? memberMap.get(selectedMemberId)
         : undefined;

      if (!selectedMember) return;

      setEditingMemberId(selectedMember.id);
      setMemberName(selectedMember.name);
      setMemberDob(selectedMember.dateOfBirth);
      setMemberGender(selectedMember.gender);
      setMemberWeight(selectedMember.weightKg);
      setMemberHeight(selectedMember.heightCm);
      setMemberProfileImage(selectedMember.profileImage ?? '');
      setIsMemberFormOpen(true);
   };

   const closeMemberForm = () => {
      setIsMemberFormOpen(false);
      resetMemberForm();
   };

   const saveMember = async () => {
      if (!memberName.trim() || !memberDob) return;

      try {
         if (editingMemberId) {
            const updated = await apiRequest<FamilyMember>(
               `/members/${editingMemberId}`,
               {
                  method: 'PUT',
                  auth: true,
                  body: JSON.stringify({
                     name: memberName.trim(),
                     dateOfBirth: memberDob,
                     gender: memberGender,
                     weightKg: memberWeight,
                     heightCm: memberHeight,
                     profileImage: memberProfileImage || undefined,
                  }),
               },
            );
            setMembers((prev) =>
               prev.map((m) => (m.id === editingMemberId ? updated : m)),
            );
         } else {
            const created = await apiRequest<FamilyMember>('/members', {
               method: 'POST',
               auth: true,
               body: JSON.stringify({
                  name: memberName.trim(),
                  dateOfBirth: memberDob,
                  gender: memberGender,
                  weightKg: memberWeight,
                  heightCm: memberHeight,
                  profileImage: memberProfileImage || undefined,
               }),
            });
            setMembers((prev) => [...prev, created]);
            setSelectedMemberId(created.id);
         }
         closeMemberForm();
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to save member');
      }
   };

   // Next

   const deleteSelectedMember = async () => {
      if (!selectedMemberId) return;

      try {
         await apiRequest<void>(`/members/${selectedMemberId}`, {
            method: 'DELETE',
            auth: true,
         });

         setMembers((prev) =>
            prev.filter((member) => member.id !== selectedMemberId),
         );
         setRecords((prev) =>
            prev.filter((record) => record.memberId !== selectedMemberId),
         );

         setSelectedMemberId('');
         setEditingRecordId(null);
      } catch (err) {
         setError(
            err instanceof Error ? err.message : 'Unable to delete member',
         );
      }
   };

   const saveRecord = async () => {
      if (!selectedMemberId) return;

      const symptoms = symptomsInput
         .split(',')
         .map((s) => s.trim())
         .filter(Boolean);

      try {
         if (editingRecordId) {
            const updated = await apiRequest<Health>(
               `/records/${editingRecordId}`,
               {
                  method: 'PUT',
                  auth: true,
                  body: JSON.stringify({
                     temperature,
                     oxygen,
                     pulseRate,
                     symptoms,
                  }),
               },
            );

            setRecords((prev) =>
               prev.map((r) => (r.id === editingRecordId ? updated : r)),
            );
            setEditingRecordId(null);
         } else {
            const created = await apiRequest<Health>('/records', {
               method: 'POST',
               auth: true,
               body: JSON.stringify({
                  memberId: selectedMemberId,
                  savedAt: new Date().toISOString(),
                  temperature,
                  oxygen,
                  pulseRate,
                  symptoms,
               }),
            });

            setRecords((prev) => [created, ...prev]);
         }

         setSymptomsInput('');
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to save record');
      }
   };

   const editRecord = (recordId: string) => {
      const selectedRecord = records.find((record) => record.id === recordId);

      if (!selectedRecord) return;

      setEditingRecordId(selectedRecord.id);
      setTemperature(selectedRecord.temperature);
      setOxygen(selectedRecord.oxygen);
      setPulseRate(selectedRecord.pulseRate);
      setSymptomsInput(selectedRecord.symptoms?.join(', ') ?? '');
   };

   const deleteRecord = async (recordId: string) => {
      try {
         await apiRequest<void>(`/records/${recordId}`, {
            method: 'DELETE',
            auth: true,
         });

         if (editingRecordId === recordId) {
            setEditingRecordId(null);
            setSymptomsInput('');
         }
      } catch (err) {
         setError(
            err instanceof Error ? err.message : 'Unable to delete record',
         );
      }
   };

   const cancelRecordEdit = () => {
      setEditingRecordId(null);
      setSymptomsInput('');
   };

   const selectedMember = selectedMemberId
      ? memberMap.get(selectedMemberId)
      : undefined;

   if (loading) {
      return (
         <div className="p-6 text-sm text-slate-600">
            Loading health records....
         </div>
      );
   }

   return (
      <div className="mx-auto max-w-5xl p-6">
         <h2 className="text-2xl font-semibold text-slate-900">
            Health Records
         </h2>

         {error && (
            <p className="mt-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
               {error}
            </p>
         )}

         <section className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
               <h3 className="text-lg font-semibold text-slate-900">
                  Family Members
               </h3>

               <button
                  onClick={openAddMemberForm}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
               >
                  + Add Family Member
               </button>
            </div>

            <MemberForm
               isOpen={isMemberFormOpen}
               title={
                  editingMemberId ? 'Edit Family Member' : 'Add Family Member'
               }
               submitLabel={editingMemberId ? 'Update Member' : 'Save Member'}
               memberName={memberName}
               memberDob={memberDob}
               memberGender={memberGender}
               memberWeight={memberWeight}
               memberHeight={memberHeight}
               profileImage={memberProfileImage}
               setMemberName={setMemberName}
               setMemberDob={setMemberDob}
               setMemberGender={setMemberGender}
               setMemberWeight={setMemberWeight}
               setMemberHeight={setMemberHeight}
               setMemberProfileImage={setMemberProfileImage}
               onSubmit={saveMember}
               onClose={closeMemberForm}
            />

            <MemberSelector
               members={members}
               selectedMemberId={selectedMemberId}
               onSelectMember={setSelectedMemberId}
            />
         </section>

         <section className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">
               Member Profile
            </h3>
            <MemberProfileCard
               member={selectedMember}
               onEditProfile={openEditMemberForm}
               onDeleteProfile={deleteSelectedMember}
            />
         </section>

         <section className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">
               Record Health Metrics
            </h3>

            <HealthMetricsForm
               temperature={temperature}
               oxygen={oxygen}
               pulseRate={pulseRate}
               symptomsInput={symptomsInput}
               selectedMemberId={selectedMemberId}
               isEditing={Boolean(editingRecordId)}
               setTemperature={setTemperature}
               setOxygen={setOxygen}
               setPulseRate={setPulseRate}
               setSymptomsInput={setSymptomsInput}
               onSaveRecord={saveRecord}
               onCancelEdit={cancelRecordEdit}
            />
         </section>

         <HealthRecordsTable
            records={records}
            selectedMemberId={selectedMemberId}
            memberMap={memberMap}
            onEditRecord={editRecord}
            onDeleteRecord={deleteRecord}
         />
      </div>
   );
}
