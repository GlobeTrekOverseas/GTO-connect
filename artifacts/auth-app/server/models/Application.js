import mongoose from 'mongoose';
const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  status: { type: String, enum: ['draft', 'submitted', 'offer_received', 'visa_processing', 'approved'], default: 'draft' },
  intake: String, course: String
}, { timestamps: true });
export default mongoose.model('Application', applicationSchema);