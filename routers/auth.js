const User = require("../models/User");
const router = require("express").Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
   const user = new User({

      username: req.body.username,
      email: req.body.email,
      password: CryptoJs.AES.encrypt(
         req.body.password,
         process.env.PASSWORD_SECRET
      ).toString(),

   });

   try {

      const savedUser = await user.save();
      res.status(201).json(savedUser);

   } catch (error) {

      res.status(500).json(error);

   }
});

router.post("/login", async (req, res) => {
   try {
      // username check
      const user = await User.findOne({ userName: req.body.username });
      !user && res.status(401).json("Your Credential wrong !");

      // password check
      const originalPassword = CryptoJs.AES.decrypt(
         user.password,
         process.env.PASSWORD_SECRET
      ).toString(CryptoJs.enc.Utf8);
      const inputPassword = req.body.password;
      originalPassword != inputPassword &&
         res.status(401).json("Your Credential wrong!");

      //create token
      const accessToken = jwt.sign(
         {
            id: user._id,
            isAdmin: user.isAdmin,
         },
         process.env.JWT_SECRET,
         { expiresIn: "3d" }
      );

      //remove user password from response data
      const { password, ...others } = user._doc;

      //response user date and new token
      res.status(201).json({ ...others, accessToken });
   } catch (error) {
      res.status(500).json(error);
   }
});

module.exports = router;
