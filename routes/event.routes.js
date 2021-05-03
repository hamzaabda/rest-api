const express = require('express');

const manageEventsController = require('../controllers/event.controller');


const router = new express.Router();

// Add a coming event
router.post('/addEvent', manageEventsController.addEvent);

// Add a coming event
router.post('/updateEvent', manageEventsController.updateEvent);





// get one coming event
router.get('/getOneEvent', manageEventsController.getOneEvent);

// get many coming events
// /events  => get all events
router.get('/getManyEvents', manageEventsController.getManyEvents);

// delete coming event
router.delete('/deleteEvent', manageEventsController.deleteEvent);


module.exports = router;
