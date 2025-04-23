const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new Error();
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth;