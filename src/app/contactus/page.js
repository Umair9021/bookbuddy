'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Send, Mail, User, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  customSubject: z.string().optional(),
  reportedUsername: z.string().optional(),
  reportReason: z.string().optional(),
  message: z.string().min(1, "Message is required"),
})
.refine(
  (data) => data.subject !== "other" || (data.customSubject?.trim() ?? "") !== "",
  { message: "Please specify a custom subject", path: ["customSubject"] }
)
.refine(
  (data) => data.subject !== "report" || (data.reportReason?.trim() ?? "") !== "",
  { message: "Report reason is required", path: ["reportReason"] }
)
.refine(
  (data) => data.subject !== "report" || (data.reportedUsername?.trim() ?? "") !== "",
  { message: "Reported username or book title is required", path: ["reportedUsername"] }
);

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      customSubject: "",
      reportedUsername: "",
      reportReason: "",
      message: "",
    },
  });

 const onSubmit = async (values) => {
  try {
    setIsSubmitting(true);
    
    const response = await fetch('/api/admin/contactus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        subject: values.subject,
        customSubject: values.customSubject,
        reportedUsername: values.reportedUsername,
        reportReason: values.reportReason,
        message: values.message
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        // Handle validation errors
        Object.keys(data.errors).forEach(field => {
          if (data.errors[field]) {
            form.setError(field, { message: data.errors[field] });
          }
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
      return;
    }

    console.log("Form submitted ✅", data);
    setSubmitSuccess(true);
    form.reset();
    
    // Scroll to success message
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Form submission error:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8 px-3 sm:px-6 bg-gray-100">
        <div className="w-full max-w-[550px]">
          {submitSuccess && (
            <Alert className="mb-6 sm:mb-2 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm sm:text-base">
                Thank you for your message! We'll get back to you within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-500 to-purple-500">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-1 mt-3">
                Contact Us
              </CardTitle>
              <CardDescription className="text-sm sm:text-sm text-slate-200 px-2">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-8 lg:px-10 pb-8 sm:pb-4 bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-6">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" /> Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" disabled={isSubmitting} {...field} className="h-12"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" disabled={isSubmitting} {...field} className="h-12"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" /> Subject *
                        </FormLabel>
                        <FormControl>
                          <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                              <SelectItem value="report">Report a User or Content</SelectItem>
                              <SelectItem value="other">Other (please specify)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional: Other */}
                  {form.watch("subject") === "other" && (
                    <FormField
                      control={form.control}
                      name="customSubject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your custom subject" disabled={isSubmitting} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Conditional: Report */}
                  {form.watch("subject") === "report" && (
                    <div className="space-y-3 mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-700">Please provide report details</h4>

                      <FormField
                        control={form.control}
                        name="reportedUsername"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username or Book Title being reported *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the username or book title" disabled={isSubmitting} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reportReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for report *</FormLabel>
                            <FormControl>
                              <Select disabled={isSubmitting} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no_show">No-Show for Meetup</SelectItem>
                                  <SelectItem value="condition_misrepresented">Book Condition Misrepresented</SelectItem>
                                  <SelectItem value="other">Other Issue</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Please describe your inquiry..." rows={5} disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
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
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
