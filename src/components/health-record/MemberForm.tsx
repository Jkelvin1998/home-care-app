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
   profileImage: string;
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
   profileImage,
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
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
         onClick={onClose}
      >
         <div
            className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
         >
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="mt-4 grid gap-3">
               <label className="grid gap-1 text-sm font-semibold text-slate-700">
                  Name
                  <input
                     type="text"
                     placeholder="Full name"
                     value={memberName}
                     onChange={(e) => setMemberName(e.target.value)}
                     className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
               </label>
               <label className="grid gap-1 text-sm font-semibold text-slate-700">
                  Date of Birth
                  <input
                     type="date"
                     value={memberDob}
                     onChange={(e) => setMemberDob(e.target.value)}
                     className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
               </label>

               <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold text-slate-700">Gender</legend>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                     {(['Female', 'Male', 'Other'] as FamilyMember['gender'][]).map((gender) => (
                        <label key={gender}>
                           <input
                              type="radio"
                              name="memberGender"
                              value={gender}
                              checked={memberGender === gender}
                              onChange={() => setMemberGender(gender)}
                              className="mr-2"
                           />
                           {gender}
                        </label>
                     ))}
                  </div>
               </fieldset>

               <label className="grid gap-1 text-sm font-semibold text-slate-700">
                  Weight (kg)
                  <input
                     type="number"
                     value={memberWeight}
                     onChange={(e) => setMemberWeight(Number(e.target.value) || 0)}
                     className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
               </label>
               <label className="grid gap-1 text-sm font-semibold text-slate-700">
                  Height (cm)
                  <input
                     type="number"
                     value={memberHeight}
                     onChange={(e) => setMemberHeight(Number(e.target.value) || 0)}
                     className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
               </label>
               <label className="grid gap-1 text-sm font-semibold text-slate-700">
                  Profile Picture (optional)
                  <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => onImageUpload(e.target.files?.[0])}
                     className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
               </label>
               {profileImage ? (
                  <div className="mt-1 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                     <img
                        src={profileImage}
                        alt="Selected profile preview"
                        className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                     />
                     <div className="text-sm text-slate-600">Preview</div>
                  </div>
               ) : null}
            </div>

            <div className="mt-5 flex justify-end gap-3">
               <button
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
               >
                  Cancel
               </button>
               <button
                  onClick={onSubmit}
                  disabled={!memberName.trim() || !memberDob}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
               >
                  {submitLabel}
               </button>
            </div>
         </div>
      </div>
   );
}
