import React from 'react';
//import { Button, Box, Typography } from '@mui/material';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import cmaLogo from './cmaLogoNoBG.png';


const NavigationBar = () => {

  const history = useHistory();

  const HandleLogout = () => {
    const storedToken = localStorage.getItem('token');
  

    fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + storedToken
      }
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('expirationTime');
          console.log("Token deleted from local storage!");
          history.push("/");
          return response;
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      
  }

  return (
    // <Box position='fixed' sx={{  top: 0,right:0, left:0, backgroundColor: '#1b657e', padding: '17px',zIndex: 1}}>
    //   <Typography >
    //   <img src={cmaLogo} alt="Logo" style={{ width: '250px', height: '80px', marginBottom: '10px', marginTop:'-6px'}} />
    //   </Typography>
    //   <Button variant="contained"  sx={{
    //     position: 'fixed',
    //     top: 17,
    //     right: 20,
    //     backgroundColor: '#2da9d2',
    //     padding: '20px',
    //     display: 'flex',
    //     justifyContent: 'flex-end'
    //     , textShadow: '2px 2px 4px rgba(0, 0, 0, 2)'
    //   }}onClick={HandleLogout}>
    //     Log Out!
    //    </Button>
     
    // </Box>

    <AppBar position="fixed">
    <Toolbar>
      {<img src={cmaLogo} alt="Logo" style={{ width: '180px', height: '50px',marginRight: '16px' }} /> }
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Corporate Management Application
      </Typography>
      <Button color="inherit" startIcon={<Logout />} onClick={HandleLogout}>
        Logout
      </Button>
    </Toolbar>
  </AppBar>
  );
}

export default NavigationBar;