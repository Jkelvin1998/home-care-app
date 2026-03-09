export type Health = {
   id: string;
   memberId: string;
   savedAt: string;
   temperature: number;
   oxygen: number;
   pulseRate: number;
   symptoms?: string[];
};

export type FamilyMember = {
   id: string;
   name: string;
   dateOfBirth: string;
   gender: 'Female' | 'Male';
   weightKg: number;
   heightCm: number;
   profileImage?: string;
};

export type HealthRecordHistory = {
   id: string;
   memberId: string;
   recordId: string;
   action: 'created' | 'updated' | 'deleted';
   actorId: string;
   actorName: string;
   changedAt: string;
   snapshot: {
      savedAt: string;
      temperature: number;
      oxygen: number;
      pulseRate: number;
      symptoms: string[];
   };
};
