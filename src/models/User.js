import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true , immutable: true},  // Makes email unchangeable after creation
  dp: { type: String, default: '' },
   role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  coverdp: { type: String, default: '' },
  major: { type: String, enum: ['Science', 'Engineering'], default: 'Science' },
  collegeName: { type: String, default: 'CTI College' },
  address: { type: String, default: '' },
  about: { type: String, default: '' },
   is_read :{type: Boolean, default:false },
  isSuspended: { type: Boolean, default: false }
}, {
  timestamps: true 
});

// Additional middleware to ensure email cannot be modified
userSchema.pre('findOneAndUpdate', function() {
  if (this.getUpdate().$set && this.getUpdate().$set.email) {
    delete this.getUpdate().$set.email;
  }
  if (this.getUpdate().email) {
    delete this.getUpdate().email;
  }
});

userSchema.pre('updateOne', function() {
  if (this.getUpdate().$set && this.getUpdate().$set.email) {
    delete this.getUpdate().$set.email;
  }
  if (this.getUpdate().email) {
    delete this.getUpdate().email;
  }
});


export default mongoose.models.User || mongoose.model('User', userSchema);