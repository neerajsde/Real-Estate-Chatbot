import resSender from "../utils/resSender.js";

export async function verifyrequest(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return resSender(res, 401, false, "Unauthorized request: API key missing");
    }

    if (apiKey !== process.env.APP_API_KEY) {
      return resSender(res, 403, false, "Forbidden: Invalid API key");
    }

    next();
  } catch (err) {
    console.error("Error while verifying request:", err.message);
    return resSender(res, 500, false, "Internal server error");
  }
}
