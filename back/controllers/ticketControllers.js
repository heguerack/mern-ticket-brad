const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const { remove, findByIdAndUpdate } = require('../models/userModel')
// const { json } = require('express')

//  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET ME  GET
const getTickets = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT, remember we get the user via middleware
  const user = await User.findById(req.user.id)
  if (!user) {
    //401= unauthorized
    res.status(401)
    throw new Error('User not authorized, plesae enter credentiaLS')
  }
  const tickets = await Ticket.find({ user: req.user.id })
  res.status(200).json(tickets)
})

//CREATE TICKET  CREATE TICKET CREATE TICKET CREATE TICKET  CREATE TICKET  CREATE TICKET CREATE TICKET CREATE TICKET
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body
  if (!product || !description) {
    res.status(400)
    throw new Error('please add a product and description')
  }
  const user = await User.findById(req.user.id)
  if (!user) {
    //401= unauthorized
    res.status(401)
    throw new Error('User not found')
  }
  const ticket = await Ticket.create({
    //so remember its not just the req,body, we have to add more
    product,
    description,
    user: req.user.id,
    status: 'new',
  })
  // to protect the route so that  no everyone can create it
  if (ticket.user.toString() !== req.user.id) {
    //401= ticket not authized
    res.status(401)
    throw new Error('ticket not authorized')
  }
  //201 we created something
  res.status(201).json(ticket)
})

// GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET  GET TICKET
const getTicket = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT, remember we get the user via middleware
  const user = await User.findById(req.user.id)
  if (!user) {
    //401= unauthorized
    res.status(401)
    throw new Error('User not authorized, plesae enter credentiaLS')
  }
  //we get the params from the url? right! because the param is the part after the product like products/produtc/1234567  thats... the product we are looking for has that id.  router.route('/:id')
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    //404= ticket not found
    res.status(404)
    throw new Error('ticket not authorized, plesae enter credentiaLS')
  }
  if (ticket.user.toString() !== req.user.id) {
    //401= ticket not authized
    res.status(401)
    throw new Error('ticket not authorized')
  }
  res.status(200).json(ticket)
})

//   DELETE TICKET   DELETE TICKET   DELETE TICKET   DELETE TICKET   DELETE TICKET   DELETE TICKET   DELETE TICKET   DELETE TICKET   DELETE TICKET   DELETE TICKET

const deleteTicket = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT, remember we get the user via middleware
  const user = await User.findById(req.user.id)
  if (!user) {
    //401= unauthorized
    res.status(401)
    throw new Error('User not authorized, plesae enter credentials')
  }
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    //404= ticket not found
    res.status(404)
    throw new Error('ticket not found')
  }
  // to protect the route (ticket) so that no evryone can delete it
  if (ticket.user.toString() !== req.user.id) {
    //401= ticket not authized
    res.status(401)
    throw new Error('ticket not authorized')
  }
  await ticket.remove()
  res.status(200).json({ success: true })
})

const updateTicket = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT, remember we get the user via middleware
  const user = await User.findById(req.user.id)
  if (!user) {
    //401= unauthorized
    res.status(401)
    throw new Error('User not authorized, plesae enter credentials')
  }
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    //404= ticket not found
    res.status(404)
    throw new Error('ticket not authorized, plesae enter credentials')
  }
  // to protect the route (ticket) so that no evryone can delete it
  if (ticket.user.toString() !== req.user.id) {
    //401= ticket not authized
    res.status(401)
    throw new Error('ticket not authorized')
  }
  // const updatedTicket = await Ticket.findByIdAndUpdate(ticket,) i was tented to do this , but w are looking for a ticket twith that id, not for a ticket with that ticket lol.
  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.status(200).json(updatedTicket)
})

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
}
