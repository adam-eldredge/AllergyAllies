console.log('Hello World')
const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT 

const app = express()

app.use('/api/example', require('./routes/report_routes'))

app.listen(port, () => console.log(`Server started, port ${port}`))

/*
- Need to connect to database
- Need to connect to frontend
*/

/* 
Setup:
    npm install express (in /backend)
    may need to run npm i dotenv mongoose
    npm i -D nodemon (updates server when changes made so you don't have to constantly restart)

Run BE server: npm run server

Test: After npm run server, should see "Hello World", Then under, "Server started, port 5000"
    On Postman, with GET, do localhost:5000/api/example ; should get message (on postman): "message": "Example"

https://www.youtube.com/watch?v=-0exw-9YJBo
*/
