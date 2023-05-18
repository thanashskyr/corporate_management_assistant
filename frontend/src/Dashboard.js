import React from 'react';
import { Button, Box } from '@mui/material';
import NavigationBar from './NavigationBar';


function Dashboard() {
  return (
    <div>
      <NavigationBar />
      <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Button variant="contained" size="large" color="primary" style={{ marginBottom: '16px' }}>
        Manage Employees
      </Button>
      <Button variant="contained" size="large" color="primary">
        Manage Departments
      </Button>
    </Box>
    </div>
  );
}

export default Dashboard;