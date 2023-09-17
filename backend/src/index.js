const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config(); //use npm run server (restarts serv when changed)

const app = express();
app.use(express.json());

// Port
const PORT = process.env.PORT;

// MongoDB username and pass
const user = process.env.USER;
const pass = process.env.PASS;

// Database uri
const uri = `mongodb+srv://${user}:${pass}@allergyallies.xuzdner.mongodb.net/Accounts?retryWrites=true&w=majority`;

// Routes
const patient_routes = require('./routes/patient_routes');
const report_routes = require('./routes/report_routes');

// Use statements
app.use('/api', patient_routes);
app.use('/api', report_routes);

app.listen(PORT, () => {
  console.log(`Hello AllergyAllies - Listening on Port ${PORT}`);
})

// Connect through mongoose
mongoose.connect(uri);
const database = mongoose.connection;

// Test connection
database.on('error', (error) => {
    console.log(error)
  })
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
