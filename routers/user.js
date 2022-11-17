const express = require('express');
const router = express.Router();

router.get('/users',(req,res)=>{
    return res.status(200).json('Hello user');
});

module.exports = router;