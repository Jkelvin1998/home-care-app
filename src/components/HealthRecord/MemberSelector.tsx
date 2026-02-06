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
      <div
         style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 16,
         }}
      >
         {members.length === 0 ? (
            <p>No family members yet.</p>
         ) : (
            members.map((member) => (
               <button
                  key={member.id}
                  onClick={() => onSelectMember(member.id)}
                  style={{
                     border: '1px solid #ccc',
                     padding: '8px 12px',
                     borderRadius: 16,
                     cursor: 'pointer',
                     backgroundColor:
                        member.id === selectedMemberId ? '#e6f0ff' : '#fff',
                  }}
               >
                  {member.name}
               </button>
            ))
         )}
      </div>
   );
}
