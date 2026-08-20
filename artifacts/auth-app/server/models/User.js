import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: String,
  savedUniversities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'University' }]
}, { timestamps: true });
export default mongoose.model('User', userSchema);