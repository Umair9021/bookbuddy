import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  // Reporter information
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  reporterEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  reporterName: {
    type: String,
    required: true, 
    trim: true,
    maxlength: 100
  },
  
  // What's being reported (one of these will be filled)
  reportedUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  reportedBook: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book'
  },
  reportedContent: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  reason: { 
    type: String, 
    required: true,
    enum: [
      'no_show',
      'condition_misrepresented', 
      'inappropriate_content',
      'spam',
      'fake_account',
      'harassment',
      'scam',
      'other'
    ]
  },
  details: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  reportType: {
    type: String,
    enum: ['user', 'book', 'meetup', 'content', 'other'],
    default: 'content'
  },
  
  status: { 
    type: String, 
    enum: ['open', 'investigating', 'action_taken', 'resolved', 'dismissed'], 
    default: 'open' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  assignedTo: {
    type: String, // Admin ID or name
    trim: true
  },
  adminNotes: [{
    note: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
   is_read :{type: Boolean, default:false },
  actionTaken: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Evidence/attachments (if any)
  evidence: [{
    type: String, // URLs or file paths to evidence
    maxlength: 500
  }],
  
  // Resolution
  resolvedAt: Date,
  resolutionNote: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Metadata for tracking
  ipAddress: String,
  userAgent: String,
  
  // Severity assessment
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'major', 'critical'],
    default: 'moderate'
  },
  
  // Follow-up tracking
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  
  // Escalation
  isEscalated: {
    type: Boolean,
    default: false
  },
  escalatedTo: String,
  escalatedAt: Date
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
reportSchema.index({ reporter: 1 });
reportSchema.index({ reportedUser: 1 });
reportSchema.index({ reportedBook: 1 });
reportSchema.index({ reporterEmail: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ reason: 1 });
reportSchema.index({ priority: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ assignedTo: 1 });

// Virtual to get reporter info (works for both registered and guest reporters)
reportSchema.virtual('reporterInfo').get(function() {
  if (this.reporter) {
    return this.populated('reporter') || { _id: this.reporter };
  }
  return {
    name: this.reporterName,
    email: this.reporterEmail,
    isGuest: true
  };
});

// Virtual to get display reason
reportSchema.virtual('displayReason').get(function() {
  const reasonMap = {
    'no_show': 'No-Show for Meetup',
    'condition_misrepresented': 'Book Condition Misrepresented',
    'inappropriate_content': 'Inappropriate Content',
    'spam': 'Spam',
    'fake_account': 'Fake Account',
    'harassment': 'Harassment',
    'scam': 'Scam',
    'other': 'Other Issue'
  };
  return reasonMap[this.reason] || this.reason;
});

// Instance Methods
reportSchema.methods.updateStatus = function(newStatus, adminNote, adminId) {
  this.status = newStatus;
  if (newStatus === 'resolved') {
    this.resolvedAt = new Date();
  }
  
  if (adminNote && adminId) {
    this.adminNotes.push({
      note: adminNote,
      addedBy: adminId,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

reportSchema.methods.assignTo = function(adminId, note = null) {
  this.assignedTo = adminId;
  if (this.status === 'open') {
    this.status = 'investigating';
  }
  
  if (note) {
    this.adminNotes.push({
      note: `Assigned to ${adminId}: ${note}`,
      addedBy: adminId,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

reportSchema.methods.escalate = function(escalatedTo, adminId, reason) {
  this.isEscalated = true;
  this.escalatedTo = escalatedTo;
  this.escalatedAt = new Date();
  this.priority = 'critical';
  
  this.adminNotes.push({
    note: `Escalated to ${escalatedTo}: ${reason}`,
    addedBy: adminId,
    addedAt: new Date()
  });
  
  return this.save();
};

reportSchema.methods.addEvidence = function(evidenceUrl, adminId) {
  this.evidence.push(evidenceUrl);
  this.adminNotes.push({
    note: `Evidence added: ${evidenceUrl}`,
    addedBy: adminId,
    addedAt: new Date()
  });
  
  return this.save();
};

reportSchema.methods.resolve = function(resolutionNote, actionTaken, adminId) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolutionNote = resolutionNote;
  if (actionTaken) {
    this.actionTaken = actionTaken;
  }
  
  this.adminNotes.push({
    note: `Report resolved: ${resolutionNote}`,
    addedBy: adminId,
    addedAt: new Date()
  });
  
  return this.save();
};

// Static Methods
reportSchema.statics.getReportStats = async function() {
  const statusStats = await this.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const reasonStats = await this.aggregate([
    { $group: { _id: '$reason', count: { $sum: 1 } } }
  ]);
  
  const typeStats = await this.aggregate([
    { $group: { _id: '$reportType', count: { $sum: 1 } } }
  ]);
  
  const priorityStats = await this.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);
  
  return {
    statusStats,
    reasonStats,
    typeStats,
    priorityStats
  };
};

reportSchema.statics.getPendingReports = function() {
  return this.find({ 
    status: { $in: ['open', 'investigating'] } 
  }).sort({ createdAt: -1 });
};

reportSchema.statics.getHighPriorityReports = function() {
  return this.find({ 
    priority: { $in: ['high', 'critical'] },
    status: { $ne: 'resolved' }
  }).sort({ priority: -1, createdAt: -1 });
};

// Pre-save middleware
reportSchema.pre('save', function(next) {
  // Auto-determine report type based on what's being reported
  if (this.isNew && this.reportType === 'content') {
    if (this.reportedUser) {
      this.reportType = 'user';
    } else if (this.reportedBook) {
      this.reportType = 'book';
    } else if (this.reason === 'no_show') {
      this.reportType = 'meetup';
    }
  }
  
  // Set priority and severity based on reason
  if (this.isNew) {
    const criticalReasons = ['harassment', 'scam'];
    const highPriorityReasons = ['fake_account', 'inappropriate_content'];
    const mediumPriorityReasons = ['no_show', 'condition_misrepresented'];
    
    if (criticalReasons.includes(this.reason)) {
      this.priority = 'critical';
      this.severity = 'critical';
    } else if (highPriorityReasons.includes(this.reason)) {
      this.priority = 'high';
      this.severity = 'major';
    } else if (mediumPriorityReasons.includes(this.reason)) {
      this.priority = 'medium';
      this.severity = 'moderate';
    } else {
      this.priority = 'low';
      this.severity = 'minor';
    }
  }
  
  next();
});

export default mongoose.models.Report || mongoose.model('Report', reportSchema);