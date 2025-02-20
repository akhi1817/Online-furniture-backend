const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken || req.header("Authorization");


    if (!token) {
      return res.status(400).json({ message: "Please Login" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; 
    }

    console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    
    req.user = decoded; 
    next(); 
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Unauthorized access", error: true, success: false });
  }
};

module.exports = auth;
