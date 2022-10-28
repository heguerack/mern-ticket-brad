const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(' ')[1]
      //veritfy token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      //get user from token, we pass decoded.id cuz we used the is=d when generating the token ...jwt.sign({ id }, process.env.TOKEN_SECRET,...
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})
module.exports = { protect }
