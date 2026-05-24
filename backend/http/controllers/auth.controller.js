import { authService } from "../../services/auth.service.js";

const sendAuth = (res, statusCode, payload, message) => {
  res.cookie("token", payload.token, authService.cookieOptions);

  res.status(statusCode).json({
    success: true,
    message,
    ...payload,
  });
};

export const registerCustomer = async (req, res, next) => {
  try {
    const payload = await authService.registerCustomer(req.body);
    sendAuth(res, 201, payload, "Customer account created");
  } catch (error) {
    next(error);
  }
};

export const registerSeller = async (req, res, next) => {
  try {
    const payload = await authService.registerSeller(req.body);
    sendAuth(res, 201, payload, "Seller account created");
  } catch (error) {
    next(error);
  }
};

export const loginCustomer = async (req, res, next) => {
  try {
    const payload = await authService.login(req.body, "customer");
    sendAuth(res, 200, payload, "Customer logged in");
  } catch (error) {
    next(error);
  }
};

export const loginSeller = async (req, res, next) => {
  try {
    const payload = await authService.login(req.body, "seller");
    sendAuth(res, 200, payload, "Seller logged in");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const payload = await authService.login(req.body, req.body.role || "customer");
    sendAuth(res, 200, payload, "Logged in");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ success: true, user: null, seller: null });
    }

    const payload = await authService.getMe(req.user._id);
    res.json({ success: true, ...payload });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.json({ success: true, message: "Profile updated", user });
  } catch (error) {
    next(error);
  }
};
