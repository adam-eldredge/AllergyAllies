const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatment_controller');

// POST localhost:5000/api/addTreatment
router.post('/addTreatment', treatmentController.addTreatment);

// GET localhost:5000/api/getAllTreatments
router.get('/getAllTreatments', treatmentController.getAllTreatments);

// GET localhost:5000/api/getTreatment
router.post('/getTreatment', treatmentController.getTreatment);

// DELETE localhost:5000/api/addTreatment
router.delete('/deleteTreatment', treatmentController.deleteTreatment);

// POST to add next treatment
router.post('/nextTreatment', treatmentController.nextTreatment);

// PATCH to change values depending on doctor
router.patch('/updateTreatment', treatmentController.updateTreatment);

module.exports = router;