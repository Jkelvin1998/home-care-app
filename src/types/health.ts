export type Health = {
   id: string;
   savedAt: string;
   temperature: number;
   oxygen: number;
   pulseRate: number;
   symptoms?: string[];
};
