import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  // Basic contact information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
     is_read :{type: Boolean, default:false },
  // Subject and message
  subject: {
    type: String,
    required: true,
    enum: ['general', 'support', 'feedback', 'report', 'other']
  },
  customSubject: {
    type: String,
    trim: true,
    maxlength: 200,
    // Only required if subject is 'other'
    validate: {
      validator: function(v) {
        return this.subject !== 'other' || (v && v.trim().length > 0);
      },
      message: 'Custom subject is required when subject is "other"'
    }
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },

  // Report-specific fields (only used when subject is 'report')
  reportDetails: {
    reportedUsername: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return this.subject !== 'report' || (v && v.trim().length > 0);
        },
        message: 'Reported username/book title is required for reports'
      }
    },
    reportReason: {
      type: String,
      enum: ['no_show', 'condition_misrepresented', 'other'],
      validate: {
        validator: function(v) {
          return this.subject !== 'report' || v;
        },
        message: 'Report reason is required for reports'
      }
    }
  },

  // Status tracking
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Admin notes and responses
  adminNotes: [{
    note: String,
    addedBy: String, // Admin username/id who added the note
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Response tracking
  responseCount: {
    type: Number,
    default: 0
  },
  lastResponseAt: Date,
  
  // User tracking (optional - for analytics)
  userAgent: String,
  ipAddress: String,
  
  // Categorization
  category: {
    type: String,
    enum: ['technical', 'general', 'complaint', 'suggestion', 'report', 'other'],
    default: function() {
      // Auto-categorize based on subject
      const categoryMap = {
        'support': 'technical',
        'feedback': 'suggestion', 
        'report': 'report',
        'general': 'general',
        'other': 'other'
      };
      return categoryMap[this.subject] || 'other';
    }
  },

  // Flags
  isUrgent: {
    type: Boolean,
    default: false
  },
  isSpam: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ subject: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ category: 1 });

// Virtual to get display subject
contactSchema.virtual('displaySubject').get(function() {
  if (this.subject === 'other' && this.customSubject) {
    return this.customSubject;
  }
  
  const subjectMap = {
    'general': 'General Inquiry',
    'support': 'Technical Support',
    'feedback': 'Feedback & Suggestions',
    'report': 'Report a User or Content',
    'other': 'Other'
  };
  
  return subjectMap[this.subject] || this.subject;
});

// Instance Methods
contactSchema.methods.markAsUrgent = function() {
  this.isUrgent = true;
  this.priority = 'urgent';
  return this.save();
};

contactSchema.methods.addAdminNote = function(note, adminId) {
  this.adminNotes.push({
    note: note,
    addedBy: adminId,
    addedAt: new Date()
  });
  return this.save();
};

contactSchema.methods.updateStatus = function(newStatus, adminNote = null, adminId = null) {
  this.status = newStatus;
  if (adminNote && adminId) {
    this.addAdminNote(`Status changed to ${newStatus}: ${adminNote}`, adminId);
  }
  return this.save();
};

// Static Methods
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const subjectStats = await this.aggregate([
    {
      $group: {
        _id: '$subject',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    statusStats: stats,
    subjectStats: subjectStats
  };
};

// Pre-save middleware
contactSchema.pre('save', function(next) {
  // Auto-set category based on subject if not already set
  if (this.isNew && !this.category) {
    const categoryMap = {
      'support': 'technical',
      'feedback': 'suggestion',
      'report': 'report',
      'general': 'general',
      'other': 'other'
    };
    this.category = categoryMap[this.subject] || 'other';
  }
  
  // Set priority based on subject
  if (this.isNew) {
    if (this.subject === 'report') {
      this.priority = 'high';
    } else if (this.subject === 'support') {
      this.priority = 'medium';
    }
  }
  
  next();
});

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);