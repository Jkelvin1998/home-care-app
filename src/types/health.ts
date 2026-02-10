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
   gender: 'Female' | 'Male' | 'Other';
   weightKg: number;
   heightCm: number;
   profileImage?: string;
};
