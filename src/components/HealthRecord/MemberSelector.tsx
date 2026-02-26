import type { FamilyMember } from '../../types/health';

type MemberSelectorProps = {
   members: FamilyMember[];
   selectedMemberId: string;
   onSelectMember: (memberId: string) => void;
};

const memberButtonBaseClasses =
   'rounded-t-2xl border-b-2 border-blue-500 px-6 py-1 text-sm font-semibold -mr-3';

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
                  type="button"
                  onClick={() => onSelectMember(member.id)}
                  aria-pressed={member.id === selectedMemberId}
                  className={`${memberButtonBaseClasses} ${member.id === selectedMemberId ? 'bg-blue-500 text-white z-10' : 'bg-white text-slate-700'}`}
               >
                  {member.name}
               </button>
            ))
         )}
      </div>
   );
}
