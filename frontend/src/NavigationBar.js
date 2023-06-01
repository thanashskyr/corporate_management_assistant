import React from 'react';
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