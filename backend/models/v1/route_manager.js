const express = require('express');
const router = express.Router();
const userRoutes = require('../../models/v1/user/routes/user.route');

// user routes
router.use('/user/', userRoutes);


module.exports = router;