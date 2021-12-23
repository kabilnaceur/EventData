const check = require('../middleware/check')
const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/comments')

router.get('/',check,CommentController.getComments)
router.get ('/:commentId',check,CommentController.getComment)
router.delete ('/:commentId',check,CommentController.deleteComment)
router.post('/',check,CommentController.createComment)
router.patch ('/:commentId',check,CommentController.editComment)


module.exports = router ;