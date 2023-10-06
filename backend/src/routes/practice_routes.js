const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practice_controller');


router.post('/addPractice', practiceController.addPractice);

router.delete('/deletePractice/:id', practiceController.deletePractice);
// get location given id
router.get('/location/:id', practiceController.getLocation);
// get logo given id
router.get('/logo/:id', practiceController.getLogo);
// get scrollingAds given id
router.get('/ads/:id', practiceController.getScrollingAds);
// get antigens tested given id
router.get('/antigens/:id', practiceController.getAntigensTested);

module.exports = router;
