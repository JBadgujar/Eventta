import Event from '../models/Event.js';
import {uploadOnCloudinary} from '../utils/fileupload.js';




// @desc    Create event
export const createEvent = async (req, res) => {
  try {
    // Extract data from request body
    const { name, description, date, location } = req.body;

    // console.log(req.body)

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    
    const imageUrl = await uploadOnCloudinary(req.file.buffer);

    
    // console.log(imageUrl)
    // const avatar = await uploadOnCloudinary(image);
    // const finalImage = await uploadOnCloudinary(image);

    // Create the event in the database
    const event = await Event.create({
      name,
      description,
      date,
      location,
      image: imageUrl,
      organizer: req.user._id, // Assuming authentication middleware adds `req.user`
    });

    // Respond with the created event
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    console.error('Event Creation Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};

// @desc    Update event
export const updateEvent = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.buffer);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        date,
        location,
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join event
export const joinEvent = async (req, res) => {
  try {
    // console.log("User trying to join:", req.user); // Debugging
    // console.log("Event ID:", req.params.id);

    const event = await Event.findById(req.params.id); 

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    
    
    if (!event.attendees.includes(req.user._id)) {
      event.attendees.push(req.user._id);
      await event.save();
      
      // Emit real-time update
      req.io.to(req.params.id).emit('attendeeUpdate', {
        eventId: req.params.id,
        attendees: event.attendees
      });
    }
    
    res.json(event);
  } catch (error) {
    console.error("Join Event Error:", error);
    res.status(500).json({ message: error.message });
  }
};