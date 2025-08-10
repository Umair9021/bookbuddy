'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Send, Mail, User, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8 px-3 sm:px-6 bg-gray-100">
        <div className="w-full max-w-2xl">
          {submitSuccess && (
            <Alert className="mb-6 sm:mb-8 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm sm:text-base">
                Thank you for your message! We'll get back to you within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-500 to-purple-500">
              <CardTitle className="text-2xl sm:text-4xl font-bold text-white mb-1 mt-3">
                Contact Us
              </CardTitle>
              <CardDescription className="text-sm sm:text-lg text-slate-200 px-2">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-8 lg:px-12 pb-8 sm:pb-12 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Name */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-slate-700 text-sm sm:text-base font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full h-12 sm:h-14 px-4 text-sm sm:text-base bg-gray-50 border-2 border-gray-300 text-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-slate-700 text-sm sm:text-base font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full h-12 sm:h-14 px-4 text-sm sm:text-base bg-gray-50 border-2 border-gray-300 text-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-slate-700 text-sm sm:text-base font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Subject *
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleInputChange('subject', value)}
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full h-12 sm:h-14 px-4 py-3 text-sm sm:text-base bg-gray-50 border-2 border-gray-300 text-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="text-sm sm:text-base">
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-slate-700 text-sm sm:text-base font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message *
                  </Label>
                  <Textarea
                    placeholder="Please describe your inquiry..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className="w-full p-3 sm:p-4 text-sm sm:text-base bg-gray-50 border-2 border-gray-300 text-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-900 disabled:opacity-50 text-white font-semibold py-4 sm:py-6 px-6 sm:px-8 text-sm sm:text-lg rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
