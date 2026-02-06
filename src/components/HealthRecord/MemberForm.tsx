import type { FamilyMember } from '../../types/health';

type MemberFormProps = {
   isOpen: boolean;
   title: string;
   submitLabel: string;
   memberName: string;
   memberDob: string;
   memberGender: FamilyMember['gender'];
   memberWeight: number;
   memberHeight: number;
   setMemberName: (value: string) => void;
   setMemberDob: (value: string) => void;
   setMemberGender: (value: FamilyMember['gender']) => void;
   setMemberWeight: (value: number) => void;
   setMemberHeight: (value: number) => void;
   setMemberProfileImage: (value: string) => void;
   onSubmit: () => void;
   onClose: () => void;
};

export default function MemberForm({
   isOpen,
   title,
   submitLabel,
   memberName,
   memberDob,
   memberGender,
   memberWeight,
   memberHeight,
   setMemberName,
   setMemberDob,
   setMemberGender,
   setMemberWeight,
   setMemberHeight,
   setMemberProfileImage,
   onSubmit,
   onClose,
}: MemberFormProps) {
   if (!isOpen) return null;

   const onImageUpload = (file?: File) => {
      if (!file) {
         setMemberProfileImage('');
         return;
      }

      const reader = new FileReader();
      reader.onload = () => {
         setMemberProfileImage(String(reader.result || ''));
      };

      reader.readAsDataURL(file);
   };

   return (
      <div
         style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
         }}
         onClick={onClose}
      >
         <div
            style={{
               backgroundColor: '#fff',
               width: 'min(560px, calc(100vw - 32px)',
               borderRadius: 12,
               padding: 20,
               boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
         >
            <h3 style={{ marginTop: 0 }}>{title}</h3>

            <div style={{ display: 'grid', gap: 12 }}>
               <label>
                  Name
                  <input
                     type="text"
                     placeholder="Full name"
                     value={memberName}
                     onChange={(e) => setMemberName(e.target.value)}
                     style={{ width: '100%', marginTop: 4 }}
                  />
               </label>

               <label>
                  Date of Birth
                  <input
                     type="date"
                     value={memberDob}
                     onChange={(e) => setMemberDob(e.target.value)}
                     style={{ width: '100%', marginTop: 4 }}
                  />
               </label>

               <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend style={{ marginBottom: 8 }}>Gender</legend>

                  <div style={{ display: 'flex', gap: 16 }}>
                     {(['Female', 'Male'] as FamilyMember['gender'][]).map(
                        (gender) => (
                           <label key={gender}>
                              <input
                                 type="radio"
                                 name="memberGender"
                                 value={gender}
                                 checked={memberGender === gender}
                                 onChange={() => setMemberGender(gender)}
                                 style={{ marginRight: 6 }}
                              />
                              {gender}
                           </label>
                        ),
                     )}
                  </div>
               </fieldset>

               <label>
                  Weight (kg)
                  <input
                     type="number"
                     value={memberWeight}
                     onChange={(e) =>
                        setMemberWeight(Number(e.target.value) || 0)
                     }
                     style={{ width: '100%', marginTop: 4 }}
                  />
               </label>

               <label>
                  Height (cm)
                  <input
                     type="number"
                     value={memberHeight}
                     onChange={(e) =>
                        setMemberHeight(Number(e.target.value) || 0)
                     }
                     style={{ width: '100%', marginTop: 4 }}
                  />
               </label>

               <label>
                  Profile Picture (optional)
                  <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => onImageUpload(e.target.files?.[0])}
                     style={{ width: '100%', marginTop: 4 }}
                  />
               </label>
            </div>

            <div
               style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                  marginTop: 20,
               }}
            >
               <button onClick={onClose}>Cancel</button>
               <button
                  onClick={onSubmit}
                  disabled={!memberName.trim() || !memberDob}
               >
                  {submitLabel}
               </button>
            </div>
         </div>
      </div>
   );
}
