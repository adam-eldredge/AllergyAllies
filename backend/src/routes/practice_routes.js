const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practice_controller');
const verifyJWT = require('../middleware/verify_JWT');

//router.use(verifyJWT)

// POST localhost:5000/api/addPractice (body)
router.post('/addPractice', practiceController.addPractice);

// GET localhost:5000/api/addPractice (body)
router.get('/practice/:id', practiceController.getPractice);

// DEL localhost:5000/api/deletePractice
router.delete('/deletePractice/:id', practiceController.deletePractice);

// GET localhost:5000/api/location/id
router.get('/location/:id', practiceController.getLocation);

// GET localhost:5000/api/logo/id
router.get('/logo/:id', practiceController.getLogo);

// GET localhost:5000/api/ads/id
router.get('/ads/:id', practiceController.getScrollingAds);

// GET localhost:5000/api/antigens/id
router.get('/antigens/:id', practiceController.getAntigensTested);

// POST localhost:5000/api/uploadLogo/id
router.post('/uploadLogo/:id', practiceController.uploadLogo);

module.exports = router;

