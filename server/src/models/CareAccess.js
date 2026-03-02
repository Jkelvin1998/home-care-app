import mongoose from 'mongoose';
import { type } from 'os';

const careAccessSchema = new mongoose.Schema(
   {
      ownerUserId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      collaboratorUserId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      addedByUserId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
   },
   { timestamps: true },
);

careAccessSchema.index(
   { ownerUserId: 1, collaboratorUserId: 1 },
   { unique: true },
);

export default mongoose.model('CareAccess', careAccessSchema);
