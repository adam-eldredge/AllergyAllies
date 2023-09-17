const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config(); 
// Use "npm run server" to have BE server restart when changed (requires nodemon)

const app = express();

// CORS
const corsMiddleware = require('./middleware/cors');
app.use(corsMiddleware);

app.use(express.json());

// Port
const PORT = process.env.PORT;

// Database uri
const uri = process.env.URI;

// Routes
const patient_routes = require('./routes/patient_routes');
const report_routes = require('./routes/report_routes');

// Use statements
app.use('/api', patient_routes);
app.use('/api', report_routes);


const server = app.listen(PORT, () => {
  console.log(`Hello AllergyAllies - Listening on Port ${PORT}`);
});

// Connect through mongoose
mongoose.connect(uri);
const database = mongoose.connection;

// Test connection
database.on('error', (error) => {
  console.log(error)
});

database.once('connected', () => {
  console.log('Database Connected');
})

// Clean shutdown
process.on('SIGINT', function() {
  console.log( "\nClean Server Shutdown Initiating... (Ctrl-C)" );
  database.close(false, () => {});
  console.log('\nDatabase connection has been closed.')
  process.exit(0);
});

module.exports = {app, server};