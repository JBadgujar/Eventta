import { Box, Typography, Button, Paper, Container } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Name: {user?.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Email: {user?.email}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Role: {user?.isGuest ? 'Guest' : 'Registered User'}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={logout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}