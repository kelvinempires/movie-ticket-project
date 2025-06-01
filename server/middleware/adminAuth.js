import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // Expect header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token payload matches admin credentials
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid admin" });
    }

    req.admin = decoded; // optional: pass admin details to next handler
    next();
  } catch (error) {
    console.log("adminAuth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Token verification failed" });
  }
};

export default adminAuth;
