// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root Test Route (Fixes 404 on http://localhost:5000/)
app.get('/', (req, res) => {
  res.send('Backend Server is Live on Port 5000!');
});

// --- REST API ENDPOINTS ---

// 1. POST /api/bookings - Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { clientName, email, service, date } = req.body;
    const newBooking = new Booking({ clientName, email, service, date });
    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// 2. GET /api/bookings - Fetch all bookings for Admin Dashboard
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// 3. PUT /api/bookings/:id - Update booking status
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// 4. DELETE /api/bookings/:id - Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));