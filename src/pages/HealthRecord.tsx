import { useEffect, useMemo, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import doctorAnimationUrl from '../assets/lottie/doctor-animation.json';

import { apiRequest } from '../lib/api';

import type { FamilyMember, Health } from '../types/health';

import HealthMetricsForm from '../components/HealthRecord/HealthMetricsForm';
import HealthRecordsTable from '../components/HealthRecord/HealthRecordsTable';
import MemberForm from '../components/HealthRecord/MemberForm';
import MemberProfileCard from '../components/HealthRecord/MemberProfileCard';
import MemberSelector from '../components/HealthRecord/MemberSelector';
import HealthTrendsChart from '../components/HealthRecord/HealthTrendsChart';

import {
   getAge,
   getOxygenStatusInfo,
   getPulseStatusInfo,
   getTemperatureStatusInfo,
} from '../utils/utils';

type RecordSortKey = 'latest' | 'temperature' | 'oxygen' | 'pulse';

export default function HealthRecord() {
   const [records, setRecords] = useState<Health[]>([]);
   const [members, setMembers] = useState<FamilyMember[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   const [temperature, setTemperature] = useState<number>(36.5);
   const [oxygen, setOxygen] = useState<number>(95);
   const [pulseRate, setPulseRate] = useState<number>(50);
   const [additionalSymptomsInput, setAdditionalSymptomsInput] = useState('');
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
   const [filterFromDate, setFilterFromDate] = useState('');
   const [filterToDate, setFilterToDate] = useState('');
   const [recordSortBy, setRecordSortBy] = useState<RecordSortKey>('latest');
   const [colorBlindMode, setColorBlindMode] = useState(false);
   const modalRef = useRef<HTMLDivElement>(null);

   const parseSymptoms = (value: string) =>
      value
         .split(',')
         .map((s) => s.trim())
         .filter(Boolean);

   const dedupeSymptoms = (symptoms: string[]) => Array.from(new Set(symptoms));

   const getAutoDetectedSymptoms = (
      currentTemperature: number,
      currentOxygen: number,
      currentPulseRate: number,
      age: number | null,
   ) => {
      const detected: string[] = [];
      const tempStatus = getTemperatureStatusInfo(currentTemperature);
      const oxygenStatus = getOxygenStatusInfo(currentOxygen);
      const pulseStatus = getPulseStatusInfo(age, currentPulseRate);

      if (tempStatus.level !== 'normal') {
         if (currentTemperature > 38.5) detected.push('High Fever');
         else if (currentTemperature < 35)
            detected.push('Critical Low Temperature');
         else if (currentTemperature < 36)
            detected.push('Low Body Temperature');
         else detected.push('Fever');
      }

      if (oxygenStatus.level === 'warning')
         detected.push('Low Oxygen Saturation');
      if (oxygenStatus.level === 'critical')
         detected.push('Critical Oxygen Level');

      if (pulseStatus.level !== 'normal') {
         if (pulseStatus.label.startsWith('High'))
            detected.push('High Pulse Rate');
         if (pulseStatus.label.startsWith('Low'))
            detected.push('Low Pulse Rate');
      }

      return dedupeSymptoms(detected);
   };

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

   // Handle modal accessibility: Escape key, focus management, and backdrop click
   useEffect(() => {
      if (!editingRecordId) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            cancelRecordEdit();
         }
      };

      const handleBackdropClick = (e: MouseEvent) => {
         if (modalRef.current === e.target) {
            cancelRecordEdit();
         }
      };

      // Focus the modal heading when opened
      const heading = modalRef.current?.querySelector('h3');
      if (heading && heading instanceof HTMLElement) {
         heading.focus();
      }

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleBackdropClick);

      return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener('click', handleBackdropClick);
      };
   }, [editingRecordId]);

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
      setError('');

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

      const autoDetectedSymptoms = getAutoDetectedSymptoms(
         temperature,
         oxygen,
         pulseRate,
         selectedMemberAge,
      );
      const otherSymptoms = parseSymptoms(additionalSymptomsInput);
      const symptoms = dedupeSymptoms([
         ...autoDetectedSymptoms,
         ...otherSymptoms,
      ]);

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

         setAdditionalSymptomsInput('');
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

      const memberAge = selectedMember
         ? getAge(selectedMember.dateOfBirth)
         : null;
      const autoDetectedForRecord = getAutoDetectedSymptoms(
         selectedRecord.temperature,
         selectedRecord.oxygen,
         selectedRecord.pulseRate,
         memberAge,
      );
      const existingSymptoms = selectedRecord.symptoms ?? [];
      const otherSymptoms = existingSymptoms.filter(
         (symptom) => !autoDetectedForRecord.includes(symptom),
      );

      setAdditionalSymptomsInput(otherSymptoms.join(', '));
   };

   const deleteRecord = async (recordId: string) => {
      try {
         await apiRequest<void>(`/records/${recordId}`, {
            method: 'DELETE',
            auth: true,
         });

         setRecords((prev) => prev.filter((r) => r.id !== recordId));

         if (editingRecordId === recordId) {
            setEditingRecordId(null);
            setAdditionalSymptomsInput('');
         }
      } catch (err) {
         setError(
            err instanceof Error ? err.message : 'Unable to delete record',
         );
      }
   };

   const cancelRecordEdit = () => {
      setEditingRecordId(null);
      setAdditionalSymptomsInput('');
   };

   const selectedMember = selectedMemberId
      ? memberMap.get(selectedMemberId)
      : undefined;

   const selectedMemberAge = selectedMember
      ? getAge(selectedMember.dateOfBirth)
      : null;

   const autoDetectedSymptoms = getAutoDetectedSymptoms(
      temperature,
      oxygen,
      pulseRate,
      selectedMemberAge,
   );

   const metricAlerts = [
      {
         metric: 'Temperature' as const,
         value: `${temperature.toFixed(1)}°C`,
         status: getTemperatureStatusInfo(temperature),
      },
      {
         metric: 'Oxygen' as const,
         value: `${oxygen}%`,
         status: getOxygenStatusInfo(oxygen),
      },
      {
         metric: 'Pulse' as const,
         value: `${pulseRate} bpm`,
         status: getPulseStatusInfo(selectedMemberAge, pulseRate),
      },
   ];

   const filteredAndSortedRecords = useMemo(() => {
      const fromTimestamp = filterFromDate
         ? new Date(`${filterFromDate}T00:00:00`).getTime()
         : null;
      const toTimestamp = filterToDate
         ? new Date(`${filterToDate}T23:59:59.999`).getTime()
         : null;

      return records
         .filter((record) => record.memberId === selectedMemberId)
         .filter((record) => {
            const recordTime = new Date(record.savedAt).getTime();

            if (fromTimestamp !== null && recordTime < fromTimestamp)
               return false;
            if (toTimestamp !== null && recordTime > toTimestamp) return false;
            return true;
         })
         .sort((a, b) => {
            if (recordSortBy === 'latest') {
               return (
                  new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
               );
            }
            if (recordSortBy === 'temperature') {
               return b.temperature - a.temperature;
            }
            if (recordSortBy === 'oxygen') {
               return b.oxygen - a.oxygen;
            }
            return b.pulseRate - a.pulseRate;
         });
   }, [records, selectedMemberId, filterFromDate, filterToDate, recordSortBy]);

   if (loading) {
      return (
         <div className="p-6 text-sm text-slate-600">
            Loading health records...
         </div>
      );
   }

   return (
      <div className="mx-auto max-w-7xl relative mt-8 space-y-6 rounded-[28px] border border-slate-500/80 p-5 pt-8 shadow-lg md:p-6 md:pt-8">
         <h2 className="absolute -top-4 left-4 bg-slate-100 px-3 text-2xl font-semibold text-slate-900">
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

         <div className="relative mt-8 space-y-6 rounded-[28px] border border-slate-500/80 p-5 pt-8 shadow-lg md:p-6 md:pt-8">
            <h3 className="absolute -top-4 left-4 bg-slate-100 px-3 text-lg font-semibold text-slate-900">
               Member Profile
            </h3>
            <section>
               <MemberProfileCard
                  member={selectedMember}
                  onEditProfile={openEditMemberForm}
                  onDeleteProfile={deleteSelectedMember}
               />
            </section>
         </div>

         <div className="relative mt-8 space-y-6 rounded-[28px] border border-slate-500/80 p-5 pt-8 shadow-lg md:p-6 md:pt-8">
            <h3 className="absolute -top-4 left-4 bg-slate-100 px-3 text-lg font-semibold text-slate-900">
               Record Health Metrics
            </h3>
            <section>
               <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_630px]">
                  <HealthMetricsForm
                     temperature={temperature}
                     oxygen={oxygen}
                     pulseRate={pulseRate}
                     autoDetectedSymptoms={autoDetectedSymptoms}
                     additionalSymptomsInput={additionalSymptomsInput}
                     selectedMemberId={selectedMemberId}
                     isEditing={false}
                     metricAlerts={metricAlerts}
                     setTemperature={setTemperature}
                     setOxygen={setOxygen}
                     setPulseRate={setPulseRate}
                     setAdditionalSymptomsInput={setAdditionalSymptomsInput}
                     onSaveRecord={saveRecord}
                     onCancelEdit={cancelRecordEdit}
                  />
                  <aside className="relative overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 via-indigo-50 to-cyan-50 p-5">
                     <div className="flex flex-col items-center justify-center">
                        {!selectedMemberId && (
                           <p className="pt-5 font-bold">
                              Add at least one family member to start saving
                              records
                           </p>
                        )}
                        <DotLottieReact
                           data={doctorAnimationUrl}
                           autoplay
                           loop
                           style={{ height: 500, width: 500, paddingTop: 40 }}
                        />
                     </div>
                  </aside>
               </div>
            </section>
         </div>

         <div className="relative mt-8 space-y-6 rounded-[28px] border border-slate-500/80 p-5 pt-8 shadow-lg md:p-6 md:pt-8">
            <h3 className="absolute -top-4 left-4 bg-slate-100 px-3 text-lg font-semibold text-slate-900">
               Health Trends
            </h3>
            <section>
               <p className="mt-1 text-sm text-slate-500">
                  A line chart is best here because these vitals are time-based
                  data and trends over time are easier to spot.
               </p>
               <HealthTrendsChart
                  records={records}
                  selectedMemberId={selectedMemberId}
               />
            </section>
         </div>

         <div className="relative mt-8 space-y-6 rounded-[28px] border border-slate-500/80 p-5 pt-8 shadow-lg md:p-6 md:pt-8">
            <h3 className="absolute -top-4 left-4 bg-slate-100 px-3 text-lg font-semibold text-slate-900">
               Health Records History
            </h3>
            <div>
               <div className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-4">
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">
                     From
                     <input
                        type="date"
                        value={filterFromDate}
                        onChange={(e) => setFilterFromDate(e.target.value)}
                        className="rounded-lg border border-slate-300  bg-white px-3 py-2 text-sm"
                     />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">
                     To
                     <input
                        type="date"
                        value={filterToDate}
                        onChange={(e) => setFilterToDate(e.target.value)}
                        className="rounded-lg border border-slate-300  bg-white px-3 py-2 text-sm"
                     />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">
                     Sort by
                     <select
                        value={recordSortBy}
                        onChange={(e) =>
                           setRecordSortBy(e.target.value as RecordSortKey)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                     >
                        <option value="latest">Latest first</option>
                        <option value="temperature">
                           Temperature (high to low)
                        </option>
                        <option value="oxygen">Oxygen (high to low)</option>
                        <option value="pulse">Pulse (high to low)</option>
                     </select>
                  </label>

                  <div className="flex items-end">
                     <button
                        onClick={() => {
                           setFilterFromDate('');
                           setFilterToDate('');
                           setRecordSortBy('latest');
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                     >
                        Reset Filters
                     </button>
                  </div>
               </div>

               <div className="mt-3 flex justify-end">
                  <button
                     onClick={() => setColorBlindMode((prev) => !prev)}
                     className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                     {colorBlindMode
                        ? 'Color-blind mode: ON'
                        : 'Color-blind mode: OFF'}
                  </button>
               </div>

               <HealthRecordsTable
                  records={filteredAndSortedRecords}
                  memberMap={memberMap}
                  onEditRecord={editRecord}
                  onDeleteRecord={deleteRecord}
                  colorBlindMode={colorBlindMode}
               />
            </div>
         </div>

         {editingRecordId && (
            <div
               ref={modalRef}
               className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
               role="dialog"
               aria-modal="true"
               aria-labelledby="edit-record-title"
            >
               <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between">
                     <h3
                        id="edit-record-title"
                        tabIndex={-1}
                        className="text-lg font-semibold text-slate-900"
                     >
                        Edit Health Record
                     </h3>
                     <button
                        onClick={cancelRecordEdit}
                        aria-label="Close"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
                     >
                        X
                     </button>
                  </div>
                  <HealthMetricsForm
                     temperature={temperature}
                     oxygen={oxygen}
                     pulseRate={pulseRate}
                     autoDetectedSymptoms={autoDetectedSymptoms}
                     additionalSymptomsInput={additionalSymptomsInput}
                     selectedMemberId={selectedMemberId}
                     isEditing={true}
                     metricAlerts={metricAlerts}
                     setTemperature={setTemperature}
                     setOxygen={setOxygen}
                     setPulseRate={setPulseRate}
                     setAdditionalSymptomsInput={setAdditionalSymptomsInput}
                     onSaveRecord={saveRecord}
                     onCancelEdit={cancelRecordEdit}
                  />
               </div>
            </div>
         )}
      </div>
   );
}
