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
      <div className="mt-4 flex flex-wrap gap-0">
         {members.length === 0 ? (
            <p className="text-sm text-slate-500">No family members yet.</p>
         ) : (
            members.map((member) => (
               <button
                  key={member.id}
                  onClick={() => onSelectMember(member.id)}
                  className={`rounded-t-2xl border-b-2 border-blue-500 px-6 py-1 text-sm font-semibold -mr-3 ${member.id === selectedMemberId ? 'border-b-2 border-blue-500 bg-blue-500 text-white z-10' : 'bg-white text-slate-700'}`}
               >
                  {member.name}
               </button>
            ))
         )}
      </div>
   );
}
