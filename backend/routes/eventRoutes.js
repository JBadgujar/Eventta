import express from 'express';
import { protect, checkOwnership } from '../middleware/authMiddleware.js';
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  joinEvent,
  getEvent
} from '../controllers/eventController.js';
import Event from '../models/Event.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.route('/')
  .post(protect,upload.single('image'), createEvent)
  .get(getEvents);

router.route('/:id')
  .get(getEvent)
  .put(protect, checkOwnership(Event), updateEvent)
  .delete(protect, checkOwnership(Event), deleteEvent);

router.post('/:id/join', protect, joinEvent);

export default router;