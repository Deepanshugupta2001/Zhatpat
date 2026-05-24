import { sellerService } from "../../services/seller.service.js";

export const getSellerDashboard = async (req, res, next) => {
  try {
    const dashboard = await sellerService.getDashboard(req.user._id);
    res.json({ success: true, dashboard });
  } catch (error) {
    next(error);
  }
};
