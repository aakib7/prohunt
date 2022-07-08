const express = require('express');
const router = express.Router();
const {getUsers} = require('../../controllers/users')


/* GET users listing. */
router.get('/',getUsers);

module.exports = router;
