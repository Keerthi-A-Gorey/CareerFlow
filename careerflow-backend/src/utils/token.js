import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "15m"
  });
};

export const generateRefreshToken = (userId) => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d"
  });
};
