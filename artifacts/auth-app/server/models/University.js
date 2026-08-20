import mongoose from 'mongoose';
const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true, index: true },
  countryCode: String, address: String, campuses: [String], intake: [String], courses: [String], tuition: String, image: String
}, { timestamps: true });
universitySchema.index({ name: 'text', country: 'text' });
export default mongoose.model('University', universitySchema);