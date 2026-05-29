const mongoose = require('mongoose');


/**
 * User Schema
 * Defines the structure and validation rules for user documents
 */
const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [5, 'Name must be at least 5 characters long'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is a mandatory field'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      required: [true, 'Role is a mandatory field'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'Username is a mandatory field'],
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    versionKey: false,
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create index on userName for faster queries
userSchema.index({ userName: 1 });

/**
 * User Model
 * Collection name: app_user_infos
 */
const userTable = mongoose.model('app_user_infos', userSchema);

module.exports = { userTable };
