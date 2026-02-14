import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      name: {
         type: String,
         required: true,
         trim: true,
      },
      dateOfBirth: {
         type: String,
         required: true,
      },
      gender: {
         type: String,
         enum: ['Female', 'Male'],
         required: true,
      },
      weightKg: {
         type: Number,
         required: true,
      },
      heightCm: {
         type: Number,
         required: true,
      },
      profileImage: { type: String },
   },
   { timestamps: true },
);

export default mongoose.model('FamilyMember', familyMemberSchema);
