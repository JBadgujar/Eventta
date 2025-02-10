import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Container,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  Stack,
  TextField,
} from '@mui/material';
import api from '../services/api';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [socket, setSocket] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        setUpdatedEvent({
          name: data.name,
          description: data.description,
          date: data.date.split('T')[0], // Format date for input field
          location: data.location,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();

    // Connect to WebSocket server
    const newSocket = io('http://localhost:5000'); 
    setSocket(newSocket);

    // Cleanup socket connection on unmount
    return () => {
      newSocket.disconnect();
    };

  }, [id]);


  
  const handleJoin = async () => {
    if (event.attendees.includes(user._id)) return; // Prevent multiple joins
  
    try {
      await api.post(`/events/${id}/join`);
      
      setEvent((prev) => ({
        ...prev,
        attendees: [...prev.attendees, user._id],
      }));
  
      socket.emit('joinEvent', { eventId: id, userId: user._id });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await api.put(`/events/${id}`, updatedEvent);
      setEvent(data);
      setEditMode(false);
      
      navigate(`/events/${id}`);

    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/events/${id}`);
      window.location.href = '/' // Redirect to home after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 3 }}>
        {event.image && (
          <CardMedia component="img" height="300" image={event.image} alt={event.name} />
        )}
        <CardContent>
          {editMode ? (
            <>
              <TextField
                fullWidth
                label="Event Name"
                margin="normal"
                value={updatedEvent.name}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                margin="normal"
                value={updatedEvent.description}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, description: e.target.value })}
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                margin="normal"
                value={updatedEvent.date}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
              />
              <TextField
                fullWidth
                label="Location"
                margin="normal"
                value={updatedEvent.location}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
              />
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {event.name}
              </Typography>

              <Stack direction="row" spacing={1} mb={2}>
                <Chip label={new Date(event.date).toLocaleDateString()} color="primary" />
                <Chip label={event.location} color="secondary" />
                <Chip label={`${event.attendees.length} Attendees`} color="success" />
              </Stack>

              <Typography variant="body1" color="text.secondary" paragraph>
                {event.description}
              </Typography>

              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{event.organizer.name[0]}</Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Organizer: {event.organizer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.organizer.email}
                  </Typography>
                </Grid>
              </Grid>

              {user && !event.attendees.includes(user._id) && (
                <Box mt={3}>
                  <Button variant="contained" size="large" fullWidth onClick={handleJoin}>
                    Join Event
                  </Button>
                </Box>
              )}

              {user && user._id === event.organizer._id && (
                <Box mt={3} display="flex" justifyContent="space-between">
                  <Button variant="contained" color="warning" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
