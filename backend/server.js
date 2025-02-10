import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import http from "http";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cloudinary from './config/cloudinaryConfig.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Cloudinary Configuration
cloudinary.config();

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);


// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinEvent', ({ eventId, userId }) => {
    console.log(`User ${userId} joined event ${eventId}`);

    // Broadcast to all clients that an attendee has joined
    io.to(eventId).emit('updateAttendance', { eventId, userId });

    // Join a specific event room
    socket.join(eventId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});