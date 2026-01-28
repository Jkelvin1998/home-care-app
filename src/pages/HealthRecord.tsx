import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Health } from '../types/health';

export default function HealthRecord() {
   const [records, setRecords] = useLocalStorage<Health[]>('healthRecords', []);

   const formatTime = (iso: string) => {
      return new Date(iso).toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit',
         hour12: true,
      });
   };

   const formatDate = (iso?: string) => {
      if (!iso) return '-';

      const d = new Date(iso);
      if (isNaN(d.getTime())) return '-';

      return d.toISOString().slice(0, 10);
   };

   const [temperature, setTemperature] = useState<number>(36.5);
   const [oxygen, setOxygen] = useState<number>(95);
   const [pulseRate, setPulseRate] = useState<number>(50);
   const [symptomsInput, setSymptomsInput] = useState('');

   const addRecords = () => {
      const symptoms = symptomsInput
         .split(',')
         .map((s) => s.trim())
         .filter(Boolean);

      setRecords((prev) => [
         ...prev,
         {
            id: uuid(),
            savedAt: new Date().toISOString(),
            temperature,
            oxygen,
            pulseRate,
            symptoms,
         },
      ]);

      setSymptomsInput('');
   };

   return (
      <div style={{ padding: 20 }}>
         <h2>Health Records</h2>

         <label>Temperature:</label>
         <input
            type="number"
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value) || 0)}
         />

         <label>Oxygen:</label>
         <input
            type="number"
            value={oxygen}
            onChange={(e) => setOxygen(Number(e.target.value) || 0)}
         />

         <label>Pulse Rate:</label>
         <input
            type="number"
            value={pulseRate}
            onChange={(e) => setPulseRate(Number(e.target.value) || 0)}
         />

         <label>Symptoms:</label>
         <input
            type="text"
            placeholder="Symptoms (e.g. Fever, Cough)"
            value={symptomsInput}
            onChange={(e) => setSymptomsInput(e.target.value)}
         />

         <button onClick={addRecords}>Save Records</button>

         <table border={1} cellPadding={8} style={{ marginTop: 20 }}>
            <thead>
               <tr>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Temp (°C)</th>
                  <th>Oxygen (%)</th>
                  <th>Pulse</th>
                  <th>Symptoms</th>
               </tr>
            </thead>
            <tbody>
               {records.map((r) => (
                  <tr key={r.id}>
                     <td>{formatTime(r.savedAt)}</td>
                     <td>{formatDate(r.savedAt)}</td>
                     <td>{r.temperature}</td>
                     <td>{r.oxygen}</td>
                     <td>{r.pulseRate}</td>
                     <td>{r.symptoms?.join(', ') || '-'}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
