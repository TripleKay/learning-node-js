const express = require("express");
const User = require("../models/User");
const {
   verifyToken,
   verifyTokenAndAuthorization,
   verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJs = require("crypto-js");
const router = express.Router();

// get all users
router.get("/users", verifyTokenAndAdmin, async (req, res) => {
   const { page = 1, limit = 10 } = req.query;
   try {
      const users = await User.find()
         .sort({ _id: -1 })
         .limit(limit * 1)
         .skip((page - 1) * limit);
      const totalUsers = await User.countDocuments();
      const totalPages = Math.ceil(totalUsers / limit);
      const currentPage = page;
      res.status(200).json({
         users,
         totalUsers: totalUsers,
         totalPages: totalPages,
         currentPage: currentPage,
      });
   } catch (error) {
      res.status(500).json(error);
   }
});

// get user detail
router.get("/users/:id", verifyTokenAndAuthorization, async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
   } catch (error) {
      res.status(500).json(error);
   }
});

//update user
router.put("/users/:id", verifyTokenAndAuthorization, async (req, res) => {
   try {
      // update user
      const updatedUser = await User.findByIdAndUpdate(
         req.params.id,
         {
            username: req.body.username,
            email: req.body.email,
         },
         { new: true }
      );

      //remove password field
      const { password, ...others } = updatedUser._doc;
      res.status(200).json(others);
   } catch (error) {
      res.status(500).json(error);
   }
});

//update user password
router.patch("/users/:id", verifyTokenAndAuthorization, async (req, res) => {
   try {
      // get request data
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;
      const confirmPassword = req.body.confirmPassword;

      const user = await User.findById(req.params.id);

      //old password check
      const dbPassword = CryptoJs.AES.decrypt(
         user.password,
         process.env.PASSWORD_SECRET
      ).toString(CryptoJs.enc.Utf8);
      if (dbPassword != oldPassword)
         return res.status(401).json("Your Old password does not match!");

      //new password & confirm password check
      if (newPassword != confirmPassword)
         return res
            .status(401)
            .json("New password and confirm password do not match!");

      //update password
      const updatedUser = await User.findByIdAndUpdate(
         req.params.id,
         {
            password: CryptoJs.AES.encrypt(
               newPassword,
               process.env.PASSWORD_SECRET
            ).toString(),
         },
         {
            new: true,
         }
      );

      return res.status(200).json("Your password has been changed!");
   } catch (error) {
      return res.status(500).json(error);
   }
});

module.exports = router;
