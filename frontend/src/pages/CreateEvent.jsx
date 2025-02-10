import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Grid
} from '@mui/material'
import api from '../services/api'

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value)
      })

      const { data } = await api.post('/events', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // console.log()
      navigate(`/events/${data.event._id}`);
    } catch (error) {
      setError(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create an Event 🎉
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Event Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <TextField
                label="Date and Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />

              <Button variant="contained" component="label" fullWidth sx={{ mt: 1 }}>
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {imagePreview ? (
              <Card sx={{ maxWidth: '100%', height: '100%' }}>
                <CardMedia component="img" height="300" image={imagePreview} alt="Event Preview" />
                <CardContent>
                  <Typography variant="h6" align="center">Image Preview</Typography>
                </CardContent>
              </Card>
            ) : (
              <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  No image selected. Upload an event image to preview it here.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}
