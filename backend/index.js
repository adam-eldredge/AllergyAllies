const express = require('express');
const mongoose = require('mongoose');

// Port
const PORT = 3000;

// MongoDB username and pass
const user = "allergyallies23"
const pass = "ZGZTYOUiZ9dkqFbs"

// Database uri
const uri = `mongodb+srv://${user}:${pass}@allergyallies.xuzdner.mongodb.net/Accounts?retryWrites=true&w=majority`;

// Routes
const routes = require('./Routes');


const app = express();
app.use(express.json());
app.use('/api', routes);
app.listen(PORT, () => {
    console.log(`Hello AllergyAllies - Listening on Port ${PORT}`)
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
