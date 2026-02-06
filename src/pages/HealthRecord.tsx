import { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import useLocalStorage from '../hooks/useLocalStorage';

import type { FamilyMember, Health } from '../types/health';

import HealthMetricsForm from '../components/HealthRecord/HealthMetricsForm';
import HealthRecordsTable from '../components/HealthRecord/HealthRecordsTable';
import MemberForm from '../components/HealthRecord/MemberForm';
import MemberProfileCard from '../components/HealthRecord/MemberProfileCard';
import MemberSelector from '../components/HealthRecord/MemberSelector';

export default function HealthRecord() {
   const [records, setRecords] = useLocalStorage<Health[]>('healthRecords', []);
   const [members, setMembers] = useLocalStorage<FamilyMember[]>(
      'familyMembers',
      [],
   );

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

      setMembers((prev) =>
         prev.filter((member) => member.id !== selectedMemberId),
      );
      setRecords((prev) =>
         prev.filter((record) => record.memberId !== selectedMemberId),
      );
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
         setEditingMemberId(null);
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
      <div style={{ padding: 20 }}>
         <h2>Health Records</h2>

         <section style={{ marginBottom: 24 }}>
            <h3>Family Members</h3>

            <button onClick={openAddMemberForm} style={{ marginBottom: 12 }}>
               + Add Family Member
            </button>

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

         <section>
            <h3>Member Profile</h3>
            <MemberProfileCard
               member={selectedMember}
               onEditProfile={openEditMemberForm}
               onDeleteProfile={deleteSelectedMember}
            />
         </section>

         <section style={{ marginTop: 24 }}>
            <h3>Record Health Metrics</h3>

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
