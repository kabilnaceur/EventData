const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const check = require('../middleware/check')


router.get('/',UserController.getUsers)
router.get ('/:userId',UserController.getUser)
router.delete ('/:userId' ,UserController.deleteUser)
router.post('/' ,UserController.signupUser)
router.post("/login" ,UserController.loginUser)
router.get('/me',check ,UserController.getCurrentUser)

module.exports = router ;