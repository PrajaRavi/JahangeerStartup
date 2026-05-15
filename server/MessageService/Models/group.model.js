import mongoose from "mongoose"
/*
  Allowed group settings

  Why enum?
  Prevent invalid setting keys
*/
const allowedSettings = [
  "onlyAdminsCanSend",
  "onlyAdminsCanEditInfo",
  "approveNewMembers",
];

const groupSchema = new mongoose.Schema(
  {
    /*
      Group name
    */
    groupName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    /*
      Group description
    */
    groupDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    /*
      Group profile image
    */
    groupProfileImage: {
      type: String,
      default: "",
    },

    /*
      Group settings

      Stores selected settings
    */
    groupSettings: [
      {
        type: String,
        enum: allowedSettings,
      },
    ],

    /*
      Group members

      Reference to User model
    */
    members: [
      {
        userID:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        LastMsgID:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "Message",
        }
      },
    ],

    LastMsgID:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },

    /*
      Group admins

      Admin users
    */
    admins: [
      {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /*
      Group creator
    */
    createdBy: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Group = mongoose.model(
  "Group",
  groupSchema
);

