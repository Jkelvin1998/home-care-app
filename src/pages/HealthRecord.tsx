import { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import HealthMetricsForm from '../components/health-record/HealthMetricsForm';
import HealthRecordsTable from '../components/health-record/HealthRecordsTable';
import MemberForm from '../components/health-record/MemberForm';
import MemberProfileCard from '../components/health-record/MemberProfileCard';
import MemberSelector from '../components/health-record/MemberSelector';
import useLocalStorage from '../hooks/useLocalStorage';
import type { FamilyMember, Health } from '../types/health';

export default function HealthRecord() {
   const [records, setRecords] = useLocalStorage<Health[]>('healthRecords', []);
   const [members, setMembers] = useLocalStorage<FamilyMember[]>('familyMembers', []);

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
   const [memberGender, setMemberGender] = useState<FamilyMember['gender']>('Female');
   const [memberWeight, setMemberWeight] = useState<number>(60);
   const [memberHeight, setMemberHeight] = useState<number>(165);
   const [memberProfileImage, setMemberProfileImage] = useState('');

   const memberMap = useMemo(() => {
      return new Map(members.map((member) => [member.id, member]));
   }, [members]);

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
      const selectedMember = selectedMemberId ? memberMap.get(selectedMemberId) : undefined;
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

   const saveMember = () => {
      if (!memberName.trim() || !memberDob) return;

      if (editingMemberId) {
         setMembers((prev) =>
            prev.map((member) =>
               member.id === editingMemberId
                  ? {
                       ...member,
                       name: memberName.trim(),
                       dateOfBirth: memberDob,
                       gender: memberGender,
                       weightKg: memberWeight,
                       heightCm: memberHeight,
                       profileImage: memberProfileImage || undefined,
                    }
                  : member,
            ),
         );
      } else {
         const newMember: FamilyMember = {
            id: uuid(),
            name: memberName.trim(),
            dateOfBirth: memberDob,
            gender: memberGender,
            weightKg: memberWeight,
            heightCm: memberHeight,
            profileImage: memberProfileImage || undefined,
         };
         setMembers((prev) => [...prev, newMember]);
         setSelectedMemberId(newMember.id);
      }

      closeMemberForm();
   };

   const deleteSelectedMember = () => {
      if (!selectedMemberId) return;

      setMembers((prev) => prev.filter((member) => member.id !== selectedMemberId));
      setRecords((prev) => prev.filter((record) => record.memberId !== selectedMemberId));
      setSelectedMemberId('');
      setEditingRecordId(null);
   };

   const saveRecord = () => {
      if (!selectedMemberId) return;

      const symptoms = symptomsInput
         .split(',')
         .map((s) => s.trim())
         .filter(Boolean);

      if (editingRecordId) {
         setRecords((prev) =>
            prev.map((record) =>
               record.id === editingRecordId
                  ? {
                       ...record,
                       temperature,
                       oxygen,
                       pulseRate,
                       symptoms,
                    }
                  : record,
            ),
         );
         setEditingRecordId(null);
      } else {
         setRecords((prev) => [
            ...prev,
            {
               id: uuid(),
               memberId: selectedMemberId,
               savedAt: new Date().toISOString(),
               temperature,
               oxygen,
               pulseRate,
               symptoms,
            },
         ]);
      }

      setSymptomsInput('');
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

   const deleteRecord = (recordId: string) => {
      setRecords((prev) => prev.filter((record) => record.id !== recordId));
      if (editingRecordId === recordId) {
         setEditingRecordId(null);
         setSymptomsInput('');
      }
   };

   const cancelRecordEdit = () => {
      setEditingRecordId(null);
      setSymptomsInput('');
   };

   const selectedMember = selectedMemberId
      ? memberMap.get(selectedMemberId)
      : undefined;

   return (
      <div className="mx-auto max-w-5xl p-6">
         <h2 className="text-2xl font-semibold text-slate-900">Health Records</h2>

         <section className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
               <h3 className="text-lg font-semibold text-slate-900">Family Members</h3>
               <button
                  onClick={openAddMemberForm}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
               >
                  + Add Family Member
               </button>
            </div>
            <MemberForm
               isOpen={isMemberFormOpen}
               title={editingMemberId ? 'Edit Family Member' : 'Add Family Member'}
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
            <h3 className="text-lg font-semibold text-slate-900">Member Profile</h3>
            <MemberProfileCard
               member={selectedMember}
               onEditProfile={openEditMemberForm}
               onDeleteProfile={deleteSelectedMember}
            />
         </section>

         <section className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">Record Health Metrics</h3>
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

         <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">Health Records History</h3>
            <HealthRecordsTable
               records={records}
               selectedMemberId={selectedMemberId}
               memberMap={memberMap}
               onEditRecord={editRecord}
               onDeleteRecord={deleteRecord}
            />
         </div>
      </div>
   );
}
