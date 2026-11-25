const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid token."
            });
        }

        const parts = authHeader.trim().split(/\s+/);

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer" ||
            !parts[1]
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization header format."
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
};

module.exports = {
    protect
};