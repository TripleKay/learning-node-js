const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routers/auth");
const userRoute = require("./routers/user");
const productRoute = require("./routers/product");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 3000;

mongoose
   .connect(process.env.MONGO_URL)
   .then(() => {
      console.log("DATABASE CONNECTION SUCCESSFULL");
   })
   .catch((error) => {
      console.log(error);
   });

//middleware
app.use(express.json());
app.use("/api/v1",userRoute);
app.use('/api/v1',authRoute);
app.use('/api/v1',productRoute);

const listener = app.listen(process.env.PORT || 3000, () => {
   console.log(listener.address());
   console.log("server is running on port: " + listener.address().port);
});
