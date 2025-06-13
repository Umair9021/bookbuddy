import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const books = await Book.find({});
    return res.status(200).json(books);
  }

  if (req.method === 'POST') {
    const { title, author, year } = req.body;
    const book = new Book({ title, author, year });
    await book.save();
    return res.status(201).json(book);
  }

  return res.status(405).end(); // Method Not Allowed
}
