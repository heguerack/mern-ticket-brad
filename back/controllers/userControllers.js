const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER  REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json(req.body)
  const { email, name, password } = req.body
  if (!email || !name || !password) {
    //but intead of below we can send an actual error
    // res.send(400).json({ message: 'please neter all values' })
    res.status(400)
    throw new Error('Please include all fileds')
  }
  // user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  //hassh password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  //create user
  const user = await User.create({ email, name, password: hashedPassword })
  if (user) {
    // 201 becasue we are creaing something = ok
    res.status(201).json({
      // we split it this way cuz we want to inlcude a token as well
      _id: user._id,
      email: user.email,
      name: user.name,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER  LOGID USER
const loginUser = asyncHandler(async (req, res) => {
  //find user
  const { email, password } = req.body
  const user = await User.findOne({ email })
  //check if user and  password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      // we split it this way cuz we want to inlcude a token as well
      _id: user._id,
      email: user.email,
      name: user.name,
      token: generateToken(user._id),
    })
  } else {
    //401 becuase its unauthorized, 400 is bad request, error from front end.
    res.status(401)
    throw new Error('Invalid credentials')
  }
  // res.status(200).json(req.body)
})

//  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET
const getMe = asyncHandler(async (req, res) => {
  // res.status(200).json(req.user)
  //so instead of sending the whole dta from user, we destructure and send backwhat we need
  const user = {
    id: req.user_id,
    email: req.user.email,
    name: req.user.name,
  }
  res.status(200).json(user)
})
// generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN  generateTOKEN

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: '30d',
  })
  return token
}
module.exports = { registerUser, loginUser, getMe }
