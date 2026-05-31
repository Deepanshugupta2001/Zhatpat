import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Seller from "../models/Seller.model.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET || "dev-secret", {
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
});

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar,
  addresses: user.addresses,
});

export const authService = {
  async registerCustomer(payload) {
    const exists = await User.findOne({ email: payload.email });

    if (exists) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ ...payload, role: "customer" });
    return { user: sanitizeUser(user), token: signToken(user._id, user.role) };
  },

  async registerSeller(payload) {
    const exists = await User.findOne({ email: payload.email });

    if (exists) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      role: "seller",
    });

    const seller = await Seller.create({
      user: user._id,
      storeName: payload.storeName,
      storeDescription: payload.storeDescription,
      gstNumber: payload.gstNumber,
    });

    return { user: sanitizeUser(user), seller, token: signToken(user._id, user.role) };
  },

  async login(payload, role) {
    const user = await User.findOne({ email: payload.email, role }).select("+password");

    if (!user || !(await user.comparePassword(payload.password))) {
      const error = new Error(`Invalid ${role} credentials`);
      error.statusCode = 401;
      throw error;
    }

    user.lastLogin = new Date();
    await user.save();

    const seller = role === "seller" ? await Seller.findOne({ user: user._id }) : null;

    return { user: sanitizeUser(user), seller, token: signToken(user._id, user.role) };
  },

  async getMe(userId) {
    const user = await User.findById(userId).select("-password");
    const seller = user?.role === "seller" ? await Seller.findOne({ user: user._id }) : null;

    return { user: sanitizeUser(user), seller };
  },

  async updateProfile(userId, payload) {
    const user = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    }).select("-password");

    return sanitizeUser(user);
  },

  cookieOptions,
};
