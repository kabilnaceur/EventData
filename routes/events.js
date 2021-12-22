const check = require('../middleware/check')
const express = require('express')
const router = express.Router()
const EventController = require('../controllers/events')

router.get('/',check,EventController.getEvents)
router.get ('/:eventId',check,EventController.getEvent)
router.delete ('/:eventId',check,EventController.deleteEvent)
router.post('/',check,EventController.createEvent)
router.put ('/:eventId',check,EventController.updateEvent)


module.exports = router ;