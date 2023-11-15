const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const alertGenerator = require('./services/alertGenerator'); //leave this, does not need value read to work

const app = express();
// To protect version information
app.disable('x-powered-by');

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
const survey_routes = require('./routes/survey_routes');
const provider_routes = require('./routes/provider_routes');
const report_routes = require('./routes/report_routes');
const export_routes = require('./routes/export_routes');
const practice_routes = require('./routes/practice_routes');
const protocol_routes = require('./routes/protocol_routes');
const auth_routes = require('./routes/auth_routes');
const treatment_routes = require('./routes/treatment_routes');

// Use statements
app.use('/api', patient_routes);
app.use('/api', provider_routes);
app.use('/api', practice_routes);
app.use('/api', survey_routes);
app.use('/api', report_routes);
app.use('/api', export_routes);
app.use('/api', protocol_routes);
app.use('/api', treatment_routes);

app.use('/auth', auth_routes);


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
