type HealthMetricsFormProps = {
   temperature: number;
   oxygen: number;
   pulseRate: number;
   symptomsInput: string;
   selectedMemberId: string;
   isEditing: boolean;
   setTemperature: (value: number) => void;
   setOxygen: (value: number) => void;
   setPulseRate: (value: number) => void;
   setSymptomsInput: (value: string) => void;
   onSaveRecord: () => void;
   onCancelEdit: () => void;
};

export default function HealthMetricsForm({
   temperature,
   oxygen,
   pulseRate,
   symptomsInput,
   selectedMemberId,
   isEditing,
   setTemperature,
   setOxygen,
   setPulseRate,
   setSymptomsInput,
   onSaveRecord,
   onCancelEdit,
}: HealthMetricsFormProps) {
   return (
      <>
         <div className="grid max-w-xl gap-3">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Temperature (°C)
               <input
                  type="number"
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Oxygen (%)
               <input
                  type="number"
                  value={oxygen}
                  onChange={(e) => setOxygen(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Pulse Rate (bpm)
               <input
                  type="number"
                  value={pulseRate}
                  onChange={(e) => setPulseRate(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Symptoms
               <input
                  type="text"
                  placeholder="Symptoms (e.g. Fever, Cough)"
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <div className="flex gap-2">
               <button
                  onClick={onSaveRecord}
                  disabled={!selectedMemberId}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
               >
                  {isEditing ? 'Update Record' : 'Save Record'}
               </button>

               {isEditing && (
                  <button
                     onClick={onCancelEdit}
                     className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                     Cancel Edit
                  </button>
               )}
            </div>
         </div>

         {!selectedMemberId && (
            <p style={{ marginTop: 8 }}>
               Add at least one family member to start saving records
            </p>
         )}
      </>
   );
}
