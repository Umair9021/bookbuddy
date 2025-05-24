"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";

export default function CardWithForm() {
  const router = useRouter();
  const [image, setImage] = React.useState(null);
  const [preview, setPreview] = React.useState(null);

  const moveback = () => {
    router.push('/');
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    // Handle form submission
  };

  return (
    <Card className="w-[500px] m-auto shadow-lg mt-20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">Add Book Details</CardTitle>
        <CardDescription className="text-gray-500">
          Fill in the details to list your book
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Title */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Title</Label>
            <Input 
              id="name" 
              placeholder="Enter book title" 
              required 
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the book's content" 
              required 
              className="min-h-[70px] focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Condition and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-gray-700">Condition</Label>
              <Select required>
                <SelectTrigger id="condition" className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="better">Better</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-700">Year</Label>
              <Select required>
                <SelectTrigger id="year" className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Year</SelectItem>
                  <SelectItem value="second">Second Year</SelectItem>
                  <SelectItem value="third">Third Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-gray-700">Book Cover</Label>
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Book preview"
                    className="h-30 w-100 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 w-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors">
                  <ImagePlus className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              <div className="text-sm text-gray-500">
                {preview ? "Cover image added" : "JPG or PNG, max 5MB"}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <CardFooter className="flex justify-between px-0 pb-0 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={moveback}
              className="hover:bg-gray-100 hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
            >
              Upload Book
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}