import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
