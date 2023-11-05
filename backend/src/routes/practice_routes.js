const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practice_controller');

//router.use(verifyJWT)

// Add a practice
router.post('/addPractice', practiceController.addPractice);

// Get a practice by ID
router.get('/practice/:id', practiceController.getPractice);

// Get a practice by code
router.get('/practiceByCode/:code', practiceController.getPracticeByCode);

// Get a practice by name
router.get('/practiceByName/:name', practiceController.getPracticeByName);

// Get a list of all practice
router.get('/getAllPractices', practiceController.getAllPractices );

// Delete a practice by ID
router.delete('/deletePractice/:id', practiceController.deletePractice);

// get location given id
router.get('/location/:id', practiceController.getLocation);

// get logo given id
router.get('/logo/:id', practiceController.getLogo);

// get scrollingAds given id
router.get('/ads/:id', practiceController.getScrollingAds);

// get antigens tested given id
router.get('/antigens/:id', practiceController.getAntigensTested);

// save uploaded images
router.post('/uploadLogo/:id', practiceController.uploadLogo);

module.exports = router;

