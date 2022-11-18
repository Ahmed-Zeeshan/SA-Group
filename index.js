const express = require('express')
const dotenv = require('dotenv').config()
const projectsRoute = require('./routes/projectsRoute.js')
const transactionsRoute = require('./routes/transactionsRoute.js')
const userRoute = require('./routes/userRoute.js')
const conn = require('./DB/connection.js')

const app = express()
const cors = require('cors')
const connectDB = require('./DB/connection.js')

const port = process.env.PORT

//Using Middlewares
app.use(cors())
app.use(express.json())



// Using Routes
app.use('/api/projects',projectsRoute)
app.use('/api/transactions',transactionsRoute)
app.use('/api/user',userRoute)

//database connection

connectDB()




app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`)
})

