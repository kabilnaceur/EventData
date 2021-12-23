const express = require('express')
const router = express.Router()
const UserController = require('../controllers/users')
const check = require('../middleware/check')


router.get('/',UserController.getUsers)
router.get('/userconn',check ,UserController.getCurrentUser)
router.get ('/:userId',UserController.getUser)
router.delete ('/:userId' ,UserController.deleteUser)
router.post('/' ,UserController.signupUser)
router.post("/login" ,UserController.loginUser)
router.post('/events',check,UserController.addEvent)
router.delete('/events/:eventId',check,UserController.deleteEvent)
router.patch('/likes/:eventId',check,UserController.addLike)
router.delete('/likes/:eventId',check,UserController.deleteLike)
router.patch('/logout', check, UserController.userLogout)

module.exports = router ;