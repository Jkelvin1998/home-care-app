import type { FamilyMember } from '../../types/health';

type MemberSelectorProps = {
   members: FamilyMember[];
   selectedMemberId: string;
   onSelectMember: (memberId: string) => void;
};

export default function MemberSelector({
   members,
   selectedMemberId,
   onSelectMember,
}: MemberSelectorProps) {
   return (
      <div className="mt-4 flex flex-wrap gap-3">
         {members.length === 0 ? (
            <p className="text-sm text-slate-500">No family members yet.</p>
         ) : (
            members.map((member) => (
               <button
                  key={member.id}
                  onClick={() => onSelectMember(member.id)}
                  className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                     member.id === selectedMemberId
                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                        : 'border-slate-300 bg-white text-slate-700'
                  }`}
               >
                  {member.name}
               </button>
            ))
         )}
      </div>
   );
}
