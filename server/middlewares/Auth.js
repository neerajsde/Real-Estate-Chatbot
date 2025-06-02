import jwt from "jsonwebtoken";
import resSender from "../utils/resSender.js";
import { redisClient } from "../config/redis.js";

export async function auth(req, res, next) {
  try {
    const token = req.cookies?.[process.env.TOKEN_NAME];

    if (!token) {
      return resSender(res, 401, false, "Authorization token is missing");
    }

    // Verify JWT and extract user ID
    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET) || {};

    if (!userId) {
      return resSender(res, 401, false, "Invalid token payload");
    }

    // Fetch user session from Redis
    const userData = await redisClient.get(`user:${userId}`);
    if (!userData) {
      return resSender(res, 401, false, "User session not found. Please log in again.");
    }

    req.user = JSON.parse(userData);
    return next();

  } catch (err) {
    console.error("Authentication Error:", err);

    const message =
      err.name === "TokenExpiredError"
        ? "Token has expired!"
        : "Internal Server Error";

    return resSender(res, 500, false, message, { message: err.message });
  }
}
