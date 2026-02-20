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

export type StatusLevel = 'normal' | 'warning' | 'critical';

export type StatusInfo = {
   label: string;
   level: StatusLevel;
};

export const getPulseStatusInfo = (
   age: number | null,
   pulse: number,
): StatusInfo => {
   const range = getPulseRange(age);

   if (pulse < range.min) {
      return { label: `Low (${range.min}-${range.max} bpm)`, level: 'warning' };
   }

   if (pulse > range.max) {
      return {
         label: `High (${range.min}-${range.max} bpm)`,
         level: 'warning',
      };
   }

   return { label: `Normal (${range.min}-${range.max} bpm)`, level: 'normal' };
};

export const getOxygenStatusInfo = (oxygenValue: number): StatusInfo => {
   if (oxygenValue >= 95) return { label: 'Normal (≥95%)', level: 'normal' };
   if (oxygenValue >= 90) return { label: 'Low (90-94%)', level: 'warning' };
   return { label: 'Critical (<90%)', level: 'critical' };
};

export const getTemperatureStatusInfo = (temperature: number): StatusInfo => {
   if (temperature < 35)
      return {
         label: 'Critical Low (<35°C)',
         level: 'critical',
      };

   if (temperature < 36)
      return {
         label: 'Low (35-35.9°C)',
         level: 'warning',
      };

   if (temperature <= 37.5)
      return {
         label: 'Normal (36-37.5°C)',
         level: 'normal',
      };

   if (temperature <= 38.5)
      return {
         label: 'Fever (37.6-38.5°C)',
         level: 'warning',
      };

   return { label: 'High Fever (>38.5°C)', level: 'critical' };
};

export const getStatusBadgeClass = (level: StatusLevel) => {
   if (level === 'normal') {
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
   }

   if (level === 'warning') {
      return 'bg-amber-100 text-amber-700 border-amber-200';
   }

   return 'bg-rose-100 text-rose-700 border-rose-200';
};

export const getStatusIndicatorClass = (
   level: StatusLevel,
   colorBlindMode: boolean,
) => {
   if (colorBlindMode) {
      if (level === 'normal') {
         return 'border-blue-700 bg-blue-200 text-blue-900';
      }
      if (level === 'warning') {
         return 'border-orange-700 bg-orange-200 text-orange-900';
      }
      return 'border-fuchsia-700 bg-fuchsia-200 text-fuchsia-900';
   }

   if (level === 'normal') {
      return 'border-emerald-700 bg-emerald-500 text-white';
   }
   if (level === 'warning') {
      return 'border-amber-700 bg-amber-200 text-orange-900';
   }
   return 'border-rose-700 bg-rose-200 text-fuchsia-900';
};

export const getStatusIndicatorLabel = (level: StatusLevel) => {
   if (level === 'normal') return 'N';
   if (level === 'warning') return 'W';
   return 'C';
};
