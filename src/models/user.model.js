import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // Required for both admins and buyers
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email must be unique
    },
    password: {
      type: String, 
      required: function () {
        return this.role === "admin"; // Password is required only for admins
      },
    },
    phoneNumber: { 
      type: String,
      required: true, // Needed for communication
    },
    property: {
      type: String, 
      required: function () {
        return this.role === "buyer"; // Property is required only for buyers
      },
    },
    role: { 
      type: String, 
      enum: ["admin", "buyer"], 
      default: "buyer", // Default role is buyer
    },
    registrationDate: {
      type: Date,
      default: Date.now, // Automatically store registration date
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

// Pre-save hook to hash password for admins
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const User = mongoose.model("User", userSchema);

export default User;
