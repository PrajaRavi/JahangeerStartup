import mongoose from "mongoose"
import { Schema } from "mongoose";
const statusSchema = new Schema({
  // 1. Status Owner
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true // Crucial for fetching a user's own stories quickly
  },

  
  // 3. View Tracker (Who has already viewed it)
  viewedBy: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    
  }],

  // 4. Media Type Indicator
  type: { 
    type: String, 
    enum: ['text', 'video', 'audio', 'image'], 
    default: 'text',
    required: true 
  },

  // 5. Polymorphic Content Object (Handles Text now, Media later)
  content: {
    // For 'text' type
    text: { type: String, trim: true },
    bgColor: { type: Number, default: 0 },
    font: { type: Number, default: 0 },

    // For future 'video/audio/image' types
    mediaUrl: { type: String, default: null },
    duration: { type: Number, default: null } // useful for video/audio length
  },

  // 6. Automated Expiry (TTL Index)
  // This automatically deletes the document from MongoDB exactly 24 hours after creation
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 86400 // 86400 seconds = 24 hours
  }
}, { timestamps: true });

// Compound Index for generating the feed efficiently
statusSchema.index({ whoCanSee: 1, createdAt: -1 });

// module.exports = mongoose.model('Status', statusSchema);
export const StatusModel=mongoose.model("Status",statusSchema)