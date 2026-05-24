import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false, minlength: 6 },
  role: { type: String, enum: ["customer", "seller"], default: "customer" },
  phone: { type: String, trim: true },
  avatar: { type: String },
  addresses: [{
    label: String,
    street: String, city: String,
    state: String, pincode: String,
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
