// app/api/admin/contactus/route.js

import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import Report from '@/models/Report';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      name,
      email,
      subject,
      customSubject,
      reportedUsername,
      reportReason,
      message
    } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return Response.json({ 
        success: false,
        message: 'Missing required fields',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          subject: !subject ? 'Subject is required' : null,
          message: !message ? 'Message is required' : null,
        }
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ 
        success: false,
        message: 'Invalid email address' 
      }, { status: 400 });
    }

    // Additional validation for conditional fields
    if (subject === 'other' && (!customSubject || customSubject.trim() === '')) {
      return Response.json({ 
        success: false,
        message: 'Custom subject is required when subject is "other"' 
      }, { status: 400 });
    }

    if (subject === 'report') {
      if (!reportedUsername || reportedUsername.trim() === '') {
        return Response.json({ 
          success: false,
          message: 'Reported username/book title is required for reports' 
        }, { status: 400 });
      }
      if (!reportReason || reportReason.trim() === '') {
        return Response.json({ 
          success: false,
          message: 'Report reason is required for reports' 
        }, { status: 400 });
      }
    }

    // Get client info for logging
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (subject === 'report') {
      // Create a report entry
      const reportData = {
        reporterName: name,
        reporterEmail: email,
        reportedContent: reportedUsername,
        reason: reportReason,
        details: message,
        reportType: 'content', // Since we don't have user accounts for reporters
        ipAddress: ipAddress,
        userAgent: userAgent
      };

      const report = new Report(reportData);
      await report.save();

      // Also create a contact entry for admin tracking
      const contactData = {
        name,
        email,
        subject,
        message,
        reportDetails: {
          reportedUsername,
          reportReason
        },
        category: 'report',
        priority: 'high', // Reports get high priority
        ipAddress: ipAddress,
        userAgent: userAgent
      };

      const contact = new Contact(contactData);
      await contact.save();

      return Response.json({
        success: true,
        message: 'Report submitted successfully',
        data: {
          contactId: contact._id,
          reportId: report._id,
          type: 'report'
        }
      }, { status: 201 });

    } else {
      // Create a regular contact entry
      const contactData = {
        name,
        email,
        subject,
        message,
        ipAddress: ipAddress,
        userAgent: userAgent
      };

      // Add custom subject if provided
      if (subject === 'other' && customSubject) {
        contactData.customSubject = customSubject;
      }

      const contact = new Contact(contactData);
      await contact.save();

      return Response.json({
        success: true,
        message: 'Message sent successfully',
        data: {
          contactId: contact._id,
          type: 'contact'
        }
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      
      return Response.json({
        success: false,
        message: 'Validation error',
        errors: errors
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}