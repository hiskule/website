const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'default-api-secret-key';

// Middleware to verify the JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded payload (id, role, etc) to req
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

// Middleware to require Admin role
function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  });
}

// Middleware to require Judge role (or Admin super-user bypass)
function verifyJudge(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === 'judge' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Judges only.' });
    }
  });
}

// Middleware to require Team role (or Admin super-user bypass)
function verifyTeam(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === 'team' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Teams only.' });
    }
  });
}

// Middleware to protect headless system scripts via API Key
function verifySystemToken(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_SECRET_KEY) {
    return res.status(403).json({ error: 'Access denied. Invalid or missing API Key.' });
  }
  next();
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyJudge,
  verifyTeam,
  verifySystemToken,
  JWT_SECRET
};
