//import express from 'express';
const express = require('express');
import { createBooking, getBookedSeats, getBookingById } from '../controllers/bookingsController';

const router = express.Router();

router.post('/', createBooking);
router.get('/booked-seats', getBookedSeats);
router.get('/:id', getBookingById);


export default router;