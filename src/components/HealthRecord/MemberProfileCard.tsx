import type { FamilyMember } from '../../types/health';
import { formatDate, getAge, getLifeStage } from '../../utils/utils';

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
      return <p>Select a family member to view their profile</p>;
   }

   const age = getAge(member.dateOfBirth);
   const stage = getLifeStage(age);

   return (
      <div
         style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            border: '1px solid #ddd',
            padding: 16,
            borderRadius: 12,
            maxWidth: 720,
         }}
      >
         {member.profileImage ? (
            <img
               src={member.profileImage}
               alt={`${member.name} profile`}
               style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #ddd',
               }}
            />
         ) : (
            <div
               style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 600,
                  color: '#555',
               }}
               aria-label={`${member.name} avatar`}
            >
               {member.name.charAt(0).toUpperCase()}
            </div>
         )}

         <div style={{ flex: 1 }}>
            <div
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
               }}
            >
               <h4 style={{ margin: 0 }}>{member.name}</h4>
               <span
                  style={{
                     backgroundColor: '#eef6ff',
                     color: '#1d4ed8',
                     padding: '2px 10px',
                     borderRadius: 999,
                     fontSize: 12,
                     fontWeight: 600,
                  }}
               >
                  {stage}
               </span>
            </div>

            <p style={{ margin: '8px 0 0' }}>
               Age: {age ?? '-'} | Gender: {member.gender}
            </p>

            <p style={{ margin: '4px 0 0' }}>
               DOB: {formatDate(member.dateOfBirth)}
            </p>

            <p style={{ margin: '4px 0 0' }}>
               Weight: {member.weightKg} kg | Height: {member.heightCm} cm
            </p>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
               <button onClick={onEditProfile}>Edit Profile</button>
               <button
                  onClick={onDeleteProfile}
                  style={{ backgroundColor: '#fee2e2', borderColor: '#fecaca' }}
               >
                  Delete Profile
               </button>
            </div>
         </div>
      </div>
   );
}
