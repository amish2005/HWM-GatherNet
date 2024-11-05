const express = require('express');
const router = express.Router();
const mapController = require('../Controllers/mapController');
const multer = require('multer');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
  });
  

//routes
router.get('/create-event', mapController.getEvents); 
router.get('/create-sport', mapController.getSports); 




// Event creation route (handling multiple file uploads)
router.post('/create-event', upload.fields([
    { name: 'eventThumbnail', maxCount: 1 },
    { name: 'additionalImages', maxCount: 4 },
  ]), mapController.createEvent);


  router.post('/create-sport', upload.fields([
    { name: 'sportThumbnail', maxCount: 1 },
    { name: 'additionalImages', maxCount: 4 },
  ]), mapController.createSport);













module.exports = router;