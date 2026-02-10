import type { FamilyMember } from '../../types/health';
import { formatDate, getAge, getLifeStage } from './utils';

type MemberProfileCardProps = {
   member?: FamilyMember;
   onEditProfile: () => void;
   onDeleteProfile: () => void;
};

export default function MemberProfileCard({
   member,
   onEditProfile,
   onDeleteProfile,
}: MemberProfileCardProps) {
   if (!member) {
      return <p>Select a family member to view their profile.</p>;
   }

   const age = getAge(member.dateOfBirth);
   const stage = getLifeStage(age);

   return (
      <div className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
         <div className="flex justify-center">
            {member.profileImage ? (
               <img
                  src={member.profileImage}
                  alt={`${member.name} profile`}
                  className="h-24 w-24 rounded-full border border-slate-200 object-cover"
               />
            ) : (
               <div
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-3xl font-semibold text-slate-600"
                  aria-label={`${member.name} avatar`}
               >
                  {member.name.charAt(0).toUpperCase()}
               </div>
            )}
         </div>
         <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
               <h4 className="text-lg font-semibold text-slate-900">{member.name}</h4>
               <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {stage}
               </span>
            </div>
            <p className="text-sm text-slate-700">Age: {age ?? '-'} | Gender: {member.gender}</p>
            <p className="text-sm text-slate-700">
               DOB: {formatDate(member.dateOfBirth)} | Weight: {member.weightKg} kg | Height:{' '}
               {member.heightCm} cm
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
               <button
                  onClick={onEditProfile}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
               >
                  Edit Profile
               </button>
               <button
                  onClick={onDeleteProfile}
                  className="rounded-lg border border-red-200 bg-red-100 px-3 py-2 text-sm font-semibold text-red-700"
               >
                  Delete Profile
               </button>
            </div>
         </div>
      </div>
   );
}
