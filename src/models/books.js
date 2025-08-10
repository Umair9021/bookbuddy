
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{type:String, required: true},
    price:{type: Number, required: true,min: [0, 'Price cannot be negative']},
    description:{type:String, required: true},
    category:{type:String, required: true},
    condition:{type:String, required: true},
    pictures: {
  type: [String],
  validate: {
    validator: (pics) => pics.length >= 1 && pics.length <= 3,
    message: 'You must provide between 1 and 3 pictures',
  },
  required: [true, 'At least one picture is required'],
},
    seller: { 
 type: String, 
  ref: 'User',
  required: true,
  default: '',
},
status: {
        type: String,
        enum: ['Available', 'sold', 'reserved'],
        default: 'Available',
        required: true,
    },
    isSold:{type:Boolean, default:false},
    soldTo: {type: String, ref: 'User'},
    createdAt:{type:Date, default:Date.now}
})

export default mongoose.models.Book || mongoose.model('Book', bookSchema);