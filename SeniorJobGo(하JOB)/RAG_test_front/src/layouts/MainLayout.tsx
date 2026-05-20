import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            시니어 잡 플랫폼
          </Typography>
        </Toolbar>
      </StyledAppBar>
      
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 시니어 잡 플랫폼. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 