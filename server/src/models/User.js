import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true, trim: true },
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      passwordHash: { type: String, required: true },
      profilePicture: {
         type: String,
         trim: true,
         default: '',
         maxlength: 2048,
         validate: {
            validator(value) {
               if (value === '') return true;

               try {
                  const parsed = new URL(value);
                  return (
                     parsed.protocol === 'http:' || parsed.protocol === 'https:'
                  );
               } catch {
                  return false;
               }
            },
            message: 'profilePicture must be a valid http(s) URL',
         },
      },
   },
   { timestamps: true },
);

export default mongoose.model('User', userSchema);
