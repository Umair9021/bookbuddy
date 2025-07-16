"use client";

import React, {  useState,useEffect } from 'react';
import { Mail, MapPin, Edit,Camera, GraduationCap, Building, } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import getImageSrc from '@/utils/getImageSrc';

const NewProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Jessica Jones',
    username:'khan',
    major: 'Computer Science',
    university: 'Stanford University',
    location: 'Stanford, CA',
    email: 'jessica.jones@example.com',
    bio: 'Avid reader and aspiring software engineer. I love exploring new worlds through books and code. My favorite genres are fantasy and sci-fi.',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    userListings: [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: '12.99',
        condition: 'Like New',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: '9.50',
        condition: 'Good',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        price: '8.00',
        condition: 'Acceptable',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
       {
        id: 4,
        title: 'Dune',
        author: 'Frank Herbert',
        price: '15.00',
        condition: 'Very Good',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ]
  });
  
  const [originalUserInfo, setOriginalUserInfo] = useState(userInfo);

  const handleEdit = () => { setOriginalUserInfo(userInfo); setIsEditing(true); };
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => { setUserInfo(originalUserInfo); setIsEditing(false); };
  const handleInputChange = (e) => setUserInfo(p => ({...p, [e.target.name]: e.target.value}));
  const handleImageUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserInfo(p => ({ ...p, [type]: e.target.result }));
      reader.readAsDataURL(file);
    }
  };
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="relative h-48 md:h-64">
        <img src={getImageSrc(userInfo.coverImage)} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        {isEditing && (
          <div className="absolute bottom-4 right-4 z-10">
            <input type="file" id="cover-upload" className="hidden" onChange={(e) => handleImageUpload('coverImage', e)} />
            <Button asChild variant="secondary" size="sm">
              <label htmlFor="cover-upload"><Camera className="w-4 h-4 mr-2" /> Change Cover</label>
            </Button>
          </div>
        )}
      </header>

      <main className="container mx-auto p-4 -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar */}
          <aside className="lg:col-span-4 lg:sticky top-4">
            <Card className="overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                 <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
                    <AvatarImage src={getImageSrc(userInfo.profileImage)} alt={userInfo.name} />
                    <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                     <div className="absolute bottom-1 right-1">
                        <input type="file" id="profile-upload" className="hidden" onChange={(e) => handleImageUpload('profileImage', e)} />
                        <Button asChild variant="secondary" size="icon" className="w-8 h-8 rounded-full">
                           <label htmlFor="profile-upload"><Camera className="w-4 h-4" /></label>
                        </Button>
                     </div>
                  )}
                </div>

                <div className="mt-4">
                  {isEditing ? (
                    <Input name="name" value={userInfo.name} onChange={handleInputChange} className="text-2xl font-bold text-center h-12" placeholder="Your Name" />
                  ) : (
                    <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                  )}
                  <p className="text-gray-500 dark:text-gray-400">@{userInfo.username}</p>
                </div>
              </div>
              <Separator />
              <CardContent className="p-6 space-y-4">
                 <div className="space-y-2">
                   <h3 className="font-semibold">About Me</h3>
                   {isEditing ? (
                      <Textarea name="bio" value={userInfo.bio} onChange={handleInputChange} placeholder="A little about yourself..." className="text-sm min-h-[100px]" />
                   ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">{userInfo.bio}</p>
                   )}
                </div>
                <Separator />
                <div className="space-y-2">
                   <h3 className="font-semibold">Education</h3>
                   {isEditing ? (
                      <div className="space-y-2">
                         <Input name="major" value={userInfo.major} onChange={handleInputChange} placeholder="Major" />
                         <Input name="university" value={userInfo.university} onChange={handleInputChange} placeholder="University" />
                      </div>
                   ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><GraduationCap className="w-4 h-4"/>{userInfo.major}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Building className="w-4 h-4"/>{userInfo.university}</div>
                      </>
                   )}
                </div>
                 <Separator />
                 <div className="space-y-2">
                    <h3 className="font-semibold">Contact</h3>
                     {isEditing ? (
                      <div className="space-y-2">
                         <Input name="location" value={userInfo.location} onChange={handleInputChange} placeholder="Location" />
                         <Input type="email" name="email" value={userInfo.email} onChange={handleInputChange} placeholder="Email" />
                      </div>
                   ) : (
                     <>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><MapPin className="w-4 h-4"/>{userInfo.location}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><Mail className="w-4 h-4"/>{userInfo.email}</div>
                     </>
                   )}
                 </div>
              </CardContent>
              {isEditing && (
                 <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                 </CardFooter>
              )}
               {!isEditing && (
                 <CardFooter>
                    <Button onClick={handleEdit} className="w-full"><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
                 </CardFooter>
               )}
            </Card>
          </aside>

          {/* Right Content */}
          <div className="lg:col-span-8 lg:mt-24">
             <Card>
               <CardHeader>
                <CardTitle>Books for Sale</CardTitle>
                <CardDescription>Books you have listed on the marketplace.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {userInfo.userListings.map(book => (
                   <Card key={book.id} className="overflow-hidden group p-0">
                      <img src={getImageSrc(book.cover)} alt={book.title} className="h-60 w-full object-cover transition-transform group-hover:scale-105" />
                      <CardContent className="p-4">
                         <h3 className="font-semibold truncate">{book.title}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                         <div className="mt-4 flex justify-between items-center">
                            <span className="font-bold text-lg">${book.price}</span>
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm">Details</Button>
                              </HoverCardTrigger>
                            </HoverCard>
                         </div>
                      </CardContent>
                   </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewProfilePage;