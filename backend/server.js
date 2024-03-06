const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000;
const { errorHandler } = require('./middleware/errorHandler')
connectDB()
const app = express()


//handle routes
app.use('/api/data',require('./routes/mdtDataRoute'))

app.get('/',(req,res)=>{res.send(`App is working on Port ${port}`)})

app.use(errorHandler)
app.listen(port, () => console.log(`Server started on port ${port}`))