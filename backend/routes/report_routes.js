const express = require('express')
const router = express.Router()
const { exampleFunc, anotherExampleFunc } = require('../controllers/route_controller')

/* Route Definitions */

// GET localhost:5000/api/example 
router.get('/', exampleFunc)

// GET localhost:5000/api/example/another 
router.get('/another', anotherExampleFunc)


module.exports = router
