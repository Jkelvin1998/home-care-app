import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      memberId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: ' FamilyMember',
         required: true,
         index: true,
      },
      savedAt: { type: String, required: true },
      temperature: { type: Number, required: true },
      oxygen: { type: Number, required: true },
      pulseRate: { type: Number, required: true },
      symptoms: [{ type: String }],
   },
   { timestamps: true },
);

export default mongoose.model('HealthRecord', healthRecordSchema);
