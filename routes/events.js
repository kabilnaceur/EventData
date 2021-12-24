const check = require('../middleware/check')
const express = require('express')
const router = express.Router()
const EventController = require('../controllers/events')

router.get('/',check,EventController.getEvents)
router.get ('/:eventId',check,EventController.getEvent)
router.get('/search',check, EventController.searchEvents)
router.delete ('/:eventId',check,EventController.deleteEvent)
router.post('/',check,EventController.createEvent)
router.put ('/:eventId',check,EventController.updateEvent)
router.post('/comments',check,EventController.addComment)
router.delete('/comments/:commentId',check,EventController.deleteComment)

module.exports = router ;