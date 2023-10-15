const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practice_controller');
const verifyJWT = require('../middleware/verify_JWT');

router.use(verifyJWT)

router.post('/addPractice', practiceController.addPractice);

router.get('/practice/:id', practiceController.getPractice);

router.get('/getAllPractices', practiceController.getAllPractices );

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

