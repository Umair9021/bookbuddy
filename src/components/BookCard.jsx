'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import getImageSrc from '@/utils/getImageSrc';

export default function BookCard({ book }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <img
          src={getImageSrc(book.imageUrl)}
          alt={book.title}
          className="rounded-md object-cover h-40 w-full"
        />
      </CardHeader>

      <CardContent>
        <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground">Seller: {book.sellerName}</p>
        <p className="text-md font-medium mt-1">Rs.{book.price}</p>
      </CardContent>

      <CardFooter className="justify-end">
        {book.videoUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(book.videoUrl, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Watch Video
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
