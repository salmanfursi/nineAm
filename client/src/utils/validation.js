export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("Must be at least 8 characters");
  if (!/\d/.test(password)) errors.push("Must contain at least one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push("Must contain at least one special character");
  return errors;
};

export const validateShops = (shops) => {
  const errors = [];
  const uniqueShops = [...new Set(shops.map((s) => s.trim().toLowerCase()))];
  if (shops.length < 3) errors.push("Must provide at least 3 shop names");
  if (uniqueShops.length !== shops.length)
    errors.push("Shop names must be unique");
  if (shops.some((shop) => !shop.trim()))
    errors.push("Shop names cannot be empty");
  return errors;
};
