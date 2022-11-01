const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("your session expired");
    }

    const [_, token] = authorization.split(" ");

    
    if (!token) {
      throw new Error("your session expired");
    }

    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    req.user = id;

    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};