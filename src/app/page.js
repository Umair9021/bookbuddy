'use client';

import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BookCard from '@/components/BookCard';

export default function HomePage() {
  const books = useSelector((state) => state.books.books);

  return (
    <main className="min-h-screen bg-muted px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-3xl text-primary text-center">📚 Welcome to BookBuddy</CardTitle>
            <CardDescription className="text-center">
              A marketplace for diploma students to upload, sell, and buy used books.
            </CardDescription>
          </CardHeader>
        </Card>

        {books.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10 text-muted-foreground text-lg">
              No books available yet. Be the first to upload! 📖
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {books.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
