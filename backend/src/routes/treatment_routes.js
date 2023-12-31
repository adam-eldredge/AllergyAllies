const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatment_controller');

// POST localhost:5000/api/addTreatment
router.post('/addTreatment', treatmentController.addTreatment);

// GET localhost:5000/api/getAllTreatments
router.get('/getAllTreatments', treatmentController.getAllTreatments);

// GET localhost:5000/api/getAllTreatmentsByID/:patientID
router.get('/getAllTreatmentsByID/:patientID', treatmentController.getAllTreatmentsByID);

// GET localhost:5000/api/getTreatment
router.post('/getTreatment', treatmentController.getTreatment);

// DELETE localhost:5000/api/addTreatment
router.delete('/deleteTreatment', treatmentController.deleteTreatment);

// POST to add next treatment
router.post('/nextTreatment', treatmentController.nextTreatment);

// PATCH to change 1 vial
router.patch('/updateAdverseTreatment', treatmentController.updateAdverseTreatment);

// PATCH to update an entire treatment for all bottles
router.patch('/updateSuccessfulTreatment', treatmentController.updateSuccessfulTreatment);

// GET to find first treatment
router.get('/getFirstTreatment/:id', treatmentController.firstTreatment);

// GET to find days since treatment
router.get('/getDaysSinceLastTreatment', treatmentController.getDaysSinceLastTreatment);

// GET to find last treatment
router.get('/getLastTreatment/:id', treatmentController.getLastTreatment);

// GET to find second to last treatment
router.get('/getSecondLastTreatment/:id', treatmentController.getSecondLastTreatment);

module.exports = router;