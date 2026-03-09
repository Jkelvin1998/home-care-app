import mongoose from 'mongoose';

const recordHistorySchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      memberId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'FamilyMember',
         required: true,
         index: true,
      },
      recordId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'HealthRecord',
         required: true,
      },
      action: {
         type: String,
         enum: ['created', 'updated', 'deleted'],
         required: true,
      },
      actorId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      actorName: {
         type: String,
         required: true,
         trim: true,
      },
      snapshot: {
         savedAt: { type: String, required: true },
         temperature: { type: Number, required: true },
         oxygen: { type: Number, required: true },
         pulseRate: { type: Number, required: true },
         symptoms: [{ type: String }],
      },
   },
   { timestamps: true },
);

recordHistorySchema.index({ userId: 1, memberId: 1, createdAt: -1 });

export default mongoose.model('RecordHistory', recordHistorySchema);
