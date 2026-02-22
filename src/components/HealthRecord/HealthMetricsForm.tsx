import { getStatusBadgeClass, type StatusInfo } from '../../utils/utils';

type MetricAlerts = {
   metric: 'Temperature' | 'Oxygen' | 'Pulse';
   status: StatusInfo;
   value: string;
};

type HealthMetricsFormProps = {
   temperature: number;
   oxygen: number;
   pulseRate: number;
   autoDetectedSymptoms: string[];
   additionalSymptomsInput: string;
   selectedMemberId: string;
   isEditing: boolean;
   metricAlerts: MetricAlerts[];
   setTemperature: (value: number) => void;
   setOxygen: (value: number) => void;
   setPulseRate: (value: number) => void;
   setAdditionalSymptomsInput: (value: string) => void;
   onSaveRecord: () => void;
   onCancelEdit: () => void;
};

export default function HealthMetricsForm({
   temperature,
   oxygen,
   pulseRate,
   autoDetectedSymptoms,
   additionalSymptomsInput,
   selectedMemberId,
   isEditing,
   metricAlerts,
   setTemperature,
   setOxygen,
   setPulseRate,
   setAdditionalSymptomsInput,
   onSaveRecord,
   onCancelEdit,
}: HealthMetricsFormProps) {
   const warningAlerts = metricAlerts.filter(
      (alert) => alert.status.level !== 'normal',
   );
   const hasCriticalAlert = warningAlerts.some(
      (alert) => alert.status.level === 'critical',
   );

   return (
      <>
         <div className="grid max-w-xl gap-3">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Temperature (°C):
               <input
                  type="number"
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Oxygen (%):
               <input
                  type="number"
                  value={oxygen}
                  onChange={(e) => setOxygen(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Pulse Rate (bpm):
               <input
                  type="number"
                  value={pulseRate}
                  onChange={(e) => setPulseRate(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Auto-detected Symptoms:
               <input
                  type="text"
                  value={
                     autoDetectedSymptoms.join(', ') ||
                     'No auto-detected symptoms'
                  }
                  readOnly
                  className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
               />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
               Other Symptoms:
               <input
                  type="text"
                  placeholder="Add other symptoms (e.g. Cough, Headache)"
                  value={additionalSymptomsInput}
                  onChange={(e) => setAdditionalSymptomsInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
               />
            </label>

            <div
               className={`rounded-xl border p-3 ${warningAlerts.length === 0 ? 'border-emerald-200 bg-emerald-50' : hasCriticalAlert ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}
            >
               <p className="text-sm font-semibold text-slate-800">
                  Automatic Vital Alerts
               </p>
               {warningAlerts.length === 0 ? (
                  <p className="mt-1 text-sm text-emerald-700">
                     All current vital signs are in the normal range.
                  </p>
               ) : (
                  <ul className="mt-2 space-y-2">
                     {warningAlerts.map((alert) => (
                        <li
                           key={alert.metric}
                           className="flex flex-wrap items-center gap-2 text-sm text-slate-700"
                        >
                           <span className="font-semibold">
                              {alert.metric}:
                           </span>
                           <span>{alert.value}</span>
                           <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-sm font-semibold ${getStatusBadgeClass(alert.status.level)}`}
                           >
                              {alert.status.label}
                           </span>
                        </li>
                     ))}
                  </ul>
               )}
            </div>

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
      </>
   );
}
