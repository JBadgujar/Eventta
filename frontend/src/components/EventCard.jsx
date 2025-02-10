import { Card, CardMedia, CardContent, Typography, Button, Chip, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function EventCard({ event }) {
  const { user } = useAuth()
  const isOrganizer = user?._id === event.organizer?._id
  // console.log(user?._id, event.organizer?._id)

  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={event.image || '/placeholder-event.jpg'}
        alt={event.name}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            {event.name}
          </Typography>
          <Chip label={`${event.attendees?.length} Attendees`} color="primary" />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {new Date(event.date).toLocaleDateString()} • {event.location}
        </Typography>
        <Typography variant="body1" noWrap>
          {event.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button component={Link} to={`/events/${event._id}`} size="small">
            View Details
          </Button>
          {isOrganizer && <Chip label="Your Event" color="success" />}
          {/* {console.log(user?._id)} */}
        </Box>
      </CardContent>
    </Card>
  )
}