import express from 'express'
import { v2 as cloudinary } from 'cloudinary'

import {
  getAllProperties,
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/property.controller.js'
import { protectRoute, adminOnly } from '../middleware/auth.middleware.js'

// import cloudinary from '../config/cloudinaryConfig.js'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkc1aimf2',
  api_key: process.env.CLOUDINARY_API_KEY || '914955393868674',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9s0qH-NO2V3KR9XqDyUvh1nQaLk'
})

const router = express.Router()

router.post('/upload/:id', async (req, res) => {
  let index = 0
  try {
    const fileStr = req.body.data
    console.log('id', req.params.id)

    // Upload the file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'properties', // This is the folder name in Cloudinary
      public_id: req.params.id, // This is the name of the image file
      upload_preset: 'ml_default' // Make sure the upload preset is correct
    })

    // Respond with the URL of the uploaded image
    res.json({ url: uploadResponse.secure_url })
  } catch (error) {
    console.log('Detailed error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/', getAllProperties)
router.get('/:id', getProperties)
router.post('/create', protectRoute, adminOnly, createProperty)
router.put('/:id', protectRoute, updateProperty)
router.delete('/:id', protectRoute, adminOnly, deleteProperty)

export default router
