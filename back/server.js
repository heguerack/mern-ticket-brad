const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const { errorMiddleware } = require('./middleware/errorMiddleware')
const PORT = process.env.PORT || 8000
const connectDB = require('./config/db')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(errorMiddleware)
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

const startApp = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`We are running on port ${PORT}`)
    })
  } catch (error) {}
}
startApp()
