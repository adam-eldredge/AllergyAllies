const express = require('express');
const router = express.Router();
const providerController = require('../controllers/provider_controller');

// POST localhost:5000/api/addProvider
router.post('/addProvider', providerController.addProvider);

// GET localhost:5000/api/getAllProviders
router.get('/getAllProviders', providerController.getAllProviders);

// GET localhost:5000/api/getProvider
router.post('/getProvider', providerController.getProvider);

// DELETE localhost:5000/api/addProvider
router.delete('/deleteProvider/:id', providerController.deleteProvider);

module.exports = router;