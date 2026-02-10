export const formatTime = (iso: string) => {
   return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
   });
};

export const formatDate = (iso?: string) => {
   if (!iso) return '-';

   const d = new Date(iso);
   if (isNaN(d.getTime())) return '-';

   return d.toISOString().slice(0, 10);
};

export const getAge = (dateOfBirth: string) => {
   const dob = new Date(dateOfBirth);
   if (Number.isNaN(dob.getTime())) return null;
   const today = new Date();
   let age = today.getFullYear() - dob.getFullYear();
   const monthDiff = today.getMonth() - dob.getMonth();
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
   }
   return age;
};

export const getPulseRange = (age: number | null) => {
   if (age === null) return { min: 60, max: 100 };
   if (age < 1) return { min: 100, max: 160 };
   if (age <= 5) return { min: 80, max: 140 };
   if (age <= 12) return { min: 70, max: 120 };
   if (age <= 17) return { min: 60, max: 100 };
   return { min: 60, max: 100 };
};

export const getLifeStage = (age: number | null) => {
   if (age === null) return 'Unknown';
   if (age < 1) return 'Infant';
   if (age <= 12) return 'Child';
   if (age <= 59) return 'Adult';
   return 'Senior';
};

export const getPulseStatus = (age: number | null, pulse: number) => {
   const range = getPulseRange(age);
   if (pulse < range.min) return `Low (${range.min}-${range.max} bpm)`;
   if (pulse > range.max) return `High (${range.min}-${range.max} bpm)`;
   return `Normal (${range.min}-${range.max} bpm)`;
};

export const getOxygenStatus = (oxygenValue: number) => {
   if (oxygenValue >= 95) return 'Normal (≥95%)';
   if (oxygenValue >= 90) return 'Low (90-94%)';
   return 'Critical (<90%)';
};
