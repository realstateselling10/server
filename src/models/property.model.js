import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    size: {
      type: String,
      required: [true, 'Size is required']
    },
    images: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      default: 'available'
    }
  },
  {
    timestamps: true
  }
)

const Property = mongoose.model('Property', propertySchema)
export default Property
