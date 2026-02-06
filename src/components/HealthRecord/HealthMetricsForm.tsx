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
         <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
            <label>
               Temperature (°C)
               <input
                  type="number"
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value) || 0)}
                  style={{ width: '100%', marginTop: 4 }}
               />
            </label>

            <label>
               Oxygen (%)
               <input
                  type="number"
                  value={oxygen}
                  onChange={(e) => setOxygen(Number(e.target.value) || 0)}
                  style={{ width: '100%', marginTop: 4 }}
               />
            </label>

            <label>
               Pulse Rate (bpm)
               <input
                  type="number"
                  value={pulseRate}
                  onChange={(e) => setPulseRate(Number(e.target.value) || 0)}
                  style={{ width: '100%', marginTop: 4 }}
               />
            </label>

            <label>
               Symptoms
               <input
                  type="text"
                  placeholder="Symptoms (e.g. Fever, Cough)"
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  style={{ width: '100%', marginTop: 4 }}
               />
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
               <button onClick={onSaveRecord} disabled={!selectedMemberId}>
                  {isEditing ? 'Update Record' : 'Save Record'}
               </button>

               {isEditing && (
                  <button onClick={onCancelEdit}>Cancel Edit</button>
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
