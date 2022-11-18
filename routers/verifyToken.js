const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
   //token check
   const authHeader = req.headers.token;
   console.log(authHeader);
   if (authHeader) {
      const token = authHeader.split(" ")[1];
      //verify token
      jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
         //user = token owner
         if (error) res.status(403).json("Token is not valid");
         req.user = user;
         next();
      });
   } else {
      return res.status(401).json("Unauthenticated !");
   }
};

//verify token and admin check || user is owner
const verifyTokenAndAuthorization = (req, res, next) => {
   verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.isAdmin) {
         next();
      } else {
         res.status(403).json("You are not allowed to do that !");
      }
   });
};

//verify token and admin check
const verifyTokenAndAdmin = (req, res, next) => {
   verifyToken(req, res, () => {
      if (req.user.isAdmin) {
         next();
      } else {
         res.status(403).json("You are not allowed to do that !");
      }
   });
};

module.exports = {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
};
