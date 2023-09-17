const express = require('express')
const router = express.Router()
const routeController = require('../controllers/route_controller')

/* Route Definitions */

// GET localhost:5000/api/example 
router.get('/example', routeController.exampleFunc);

// GET localhost:5000/api/example/another 
router.get('/another', routeController.anotherExampleFunc);

module.exports = router;
