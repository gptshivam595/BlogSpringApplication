import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Welcome</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Multi-page React Router UI with role-based admin/user screens connected to your Spring backend.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button component={Link} to="/posts" variant="contained">Browse Posts</Button>
          <Button component={Link} to="/login" variant="outlined">Login</Button>
          <Button component={Link} to="/register" variant="outlined">Register</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
