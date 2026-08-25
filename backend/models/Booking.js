// backend/models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);