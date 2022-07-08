const express = require('express');
const router = express.Router();
const {register,logout,getUsers} = require('../../controllers/users')


/* GET users listing. */
router.post('/register',register);
router.get('/logout',logout)


module.exports = router;
