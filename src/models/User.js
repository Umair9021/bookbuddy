import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  dp: { type: String, default: '' },
  coverdp: { type: String, default: '' },
  major: { type: String, enum: ['Science', 'Engineering'], default: 'Science' },
  collegeName: { type: String, default: 'CTI College' },
  address: { type: String, default: '' },
  about: { type: String, default: '' },
  username: { type: String, required: true },
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

export default mongoose.models.User || mongoose.model('User', userSchema);