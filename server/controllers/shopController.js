const Shop = require("../models/Shop");

exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("owner", "username");
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shops" });
  }
};

exports.verifyShop = async (req, res) => {
  console.log("shopname------------>", req.params.shopname);
  try {
    const { shopname } = req.params;
    const user = req.user;
    const normalizedShopname = shopname.toLowerCase();
    const userShops = user.shops.map((shop) => shop.toLowerCase());
    if (!userShops.includes(normalizedShopname)) {
      return res.status(403).json({ message: "You do not own this shop" });
    }
    res.json({
      message: `Welcome to ${shopname} shop`,
      shopName: shopname,
      owner: user.username,
    });
  } catch (error) {
    console.error("Shop verification error:", error);
    res.status(500).json({ message: "Server error verifying shop access" });
  }
};
