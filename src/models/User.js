import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
  name: {type:String , required: true},
  email: { type: String, unique: true,required: true},
  dp:{type: String,default:''},
  coverdp:{type: String,default:''},
  department:{type:String,enum: ['Science','IT', 'Engineering'],default: 'Science'},
  post:{type:String,enum: ['Senior', 'Junior'],default: 'Junior' },
  collegeName:{type:String, default: ''},
  address:{type:String, default: ''},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);