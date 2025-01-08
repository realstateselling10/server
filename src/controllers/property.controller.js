import Property from '../models/property.model.js'
import { v2 as cloudinary } from 'cloudinary'

// Controller for admin only to create property
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, images, size, status } =
      req.body
    if (!title || !description || !price || !location || !size) {
      return res.status(400).json({ error: 'All fields are required.' })
    }

    const property = new Property({
      title,
      description,
      price,
      location,
      size,
      images,
      status
    })

    await property.save()
    res
      .status(201)
      .json({ message: 'Property created successfully.', property })
  } catch (error) {
    console.error('Error creating property:', error.message)
    res.status(500).json({ error: error.message })
  }
}

//update property by admin only
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, price, location, images, size, status } =
      req.body

    // Find the property by id
    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }

    // Handle images
    let updatedImages = [...(property.images || [])]

    // If new images are provided and they're not just URLs
    if (images && images.length > 0) {
      for (let image of images) {
        // Check if the image is a data URL (new upload)
        if (image.startsWith('data:')) {
          try {
            const uploadResponse = await cloudinary.uploader.upload(image, {
              folder: 'properties',
              upload_preset: 'ml_default'
            })
            updatedImages.push(uploadResponse.secure_url)
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError)
            throw new Error('Failed to upload image')
          }
        } else {
          // If it's already a URL, keep it
          updatedImages.push(image)
        }
      }
    }

    // Update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        title: title || property.title,
        description: description || property.description,
        price: price || property.price,
        location: location || property.location,
        size: size || property.size,
        images: updatedImages,
        status: status || property.status
      },
      { new: true }
    )

    res.status(200).json({
      message: 'Property updated successfully',
      property: updatedProperty
    })
  } catch (error) {
    console.error('Error in updating property:', error)
    res.status(500).json({ error: error.message })
  }
}

//delete the property by admin only
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params
    const property = await Property.findById(id)

    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }

    // Delete images from Cloudinary
    for (let image of property.images) {
      try {
        if (image) {
          const public_id = image.split('/').slice(-1)[0].split('.')[0] // Getting the public_id of the image
          console.log('public id is', public_id)
          const result = await cloudinary.uploader.destroy(
            `properties/${public_id}`
          )
          console.log('result', result)
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError)
        // Continue with other images even if one fails
      }
    }

    await Property.findByIdAndDelete(id)
    res.status(200).json({ message: 'Property deleted successfully.' })
  } catch (error) {
    console.error('Error in deleting property:', error.message)
    res.status(500).json({ error: error.message })
  }
}

//front end for any one
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.findById(req.params.id)
    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//front end for any one
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
