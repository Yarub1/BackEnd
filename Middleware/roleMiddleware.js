// File: Middleware/roleMiddleware.js
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.role) {
      return res.status(403).json({ message: "Access denied: role not found" });
    }
    if (!roles.includes(req.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient privileges" });
    }
    next();
  };
};

export default verifyRole;
