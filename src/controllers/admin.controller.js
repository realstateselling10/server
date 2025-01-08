import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../config/generateToken.js'

export const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body
    if (!fullName || !phoneNumber || !email || !password) {
      return res.status(400).json({ error: 'All fields are Required.' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(422).json({ error: 'Invalid email format' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'email is already taken' })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long' })
    }

    const user = new User({
      fullName,
      email,
      password,
      phoneNumber,
      role: 'admin'
    })
    await user.save()
    res.status(201).json({ message: 'Admin created successfully.' })
  } catch (error) {
    console.log('error in signnup controller', error)
    res.status(500).json({ error: error.message })
  }
}

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const admin = await User.findOne({ email, role: 'admin' })
    if (!admin) return res.status(401).json({ message: 'invalid credentials' })

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials.' })

    const token = generateTokenAndSetCookie(admin.id, admin.role, res)
    // console.log(token)
    res.status(200).json({ message: 'login sucessfull', token: token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie('jwtCookie', '', { maxAge: 0 })
    res.status(200).json({ message: 'Logout Sucessfull' })
  } catch (error) {
    console.error('Error in logout controller', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
