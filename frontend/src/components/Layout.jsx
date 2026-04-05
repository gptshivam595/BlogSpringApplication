import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkSx = {
  color: 'inherit',
  textDecoration: 'none',
  px: 1,
  py: 0.5,
  borderRadius: 1,
  '&.active': {
    bgcolor: 'primary.light',
    color: 'primary.contrastText',
  },
}

export default function Layout() {
  const { isAuthenticated, currentUser, logout } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{ color: 'text.primary', textDecoration: 'none', mr: 2 }}
          >
            Blog Frontend
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexGrow: 1, flexWrap: 'wrap' }}>
            <Box component={NavLink} to="/" end sx={linkSx}>Home</Box>
            <Box component={NavLink} to="/posts" sx={linkSx}>Posts</Box>
            <Box component={NavLink} to="/admin" sx={linkSx}>Admin</Box>
            <Box component={NavLink} to="/user" sx={linkSx}>User</Box>
            {!isAuthenticated ? (
              <>
                <Box component={NavLink} to="/login" sx={linkSx}>Login</Box>
                <Box component={NavLink} to="/register" sx={linkSx}>Register</Box>
              </>
            ) : (
              <Button size="small" variant="outlined" onClick={logout}>Logout</Button>
            )}
          </Stack>

          <Chip size="small" label={currentUser?.email || 'Guest'} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
