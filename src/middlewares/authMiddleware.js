const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Middleware to verify JWT token from Authorization header.
 */
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided or invalid format.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded token payload (e.g., { userId, role }) to req.user for downstream use
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

/**
 * Middleware factory for Role-Based Access Control (RBAC).
 * Enforces that only users with the provided roles can access the route.
 * 
 * @param  {...string} allowedRoles - The roles that are allowed to access (e.g., 'ADMIN', 'DOCTOR')
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // verifyToken must be called before authorizeRoles
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized. User information is missing.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions to access this resource.' });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles
};
