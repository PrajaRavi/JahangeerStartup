import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

SocketId:{
  type:String,
  trim: true,
      
  
},

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
verificationCode: {
  type: String,
  default: "",
},
verificationCodeExpires: {
  type: Date,
},
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    profilePicture: {
      type: String,
      default: "",
    },
/**
 * 
bio: {
  type: String,
  default: "",
  maxlength: [150, "Bio cannot exceed 150 characters"],
  },

  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: null,
  },
  // Privacy Layer (Who is allowed to see status fo this user)
  // If empty, it could mean "Public" or "All Contacts" depending on your business logic
  whoCanSee: [{ 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User',
  index: true // Indexed because friends will query this field to see their feed
  }],
*/

    phoneNumber: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },




    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);

