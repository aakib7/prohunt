const express = require('express');
const router = express.Router();
const {register,logout,login,myProfile,changePassword} = require('../../controllers/users')
const { isAuthenticated } = require('../../middlewares/auth');

/* GET users listing. */
router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout)
router.get('/me',isAuthenticated,myProfile)
router.post('/changepassword',isAuthenticated,changePassword)


module.exports = router;
