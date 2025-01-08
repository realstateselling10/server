import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import connectDB from './src/config/db.js'

import adminRoutes from './src/routes/admin.route.js'
import userRoutes from './src/routes/user.route.js'
import propertyRoutes from './src/routes/property.route.js'

const app = express()
dotenv.config()

const Port = process.env.PORT || 5010
//middlewares
// Increase the limit for JSON payloads
app.use(express.json({ limit: '50mb' }))
// If you're also using URL-encoded payloads, increase that limit too
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CLIENT_URL, // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

//Routes
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)
app.use('/api/property', propertyRoutes)

app.listen(Port, () => {
  console.log(`Server is running on ${Port}`)
  connectDB()
})
