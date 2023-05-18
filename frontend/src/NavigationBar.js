import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

const useHandleLogout = () => {
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
  return HandleLogout;
}

function NavigationBar() {

  const HandleLogout = useHandleLogout();

  return (
    <Box sx={{ backgroundColor: 'grey', padding: '20px' }}>
      <Typography variant="h5" sx={{ color: 'white', mb: 3, mr: 2, mt: 3 }}>
        Welcome to Corporation Management App!
      </Typography>
      <Button variant="outlined" sx={{ bgcolor: '#2196f3', color: 'white' }} onClick={HandleLogout}>
        Log Out!
      </Button>
    </Box>
  );
}

export default NavigationBar;