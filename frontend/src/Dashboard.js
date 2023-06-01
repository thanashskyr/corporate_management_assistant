import React from 'react';
import { Button, Box } from '@mui/material';
import NavigationBar from './NavigationBar';
import { useHistory } from 'react-router-dom';


const Dashboard = () => {

  const history = useHistory();
  
  const HandleEmployee = async () => {
    history.push("./Employee");
};
  
  const HandleDepartment = async() => {
    history.push("./Department");
  };
  

  return (
    <div>
      <NavigationBar />

      <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      height="50vh"
    >
      <Button variant="contained" size="large" color="primary" style={{ marginBottom: '1%', marginRight: '2%' }} sx={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', width: '15%', height: '32%', fontSize: '1.3rem'}} onClick={HandleEmployee}>
        Manage Employees 
      </Button>
      <Button variant="contained" size="large" color="primary" style={{ marginBottom: '1%', marginLeft: '2%' }} sx={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', width: '15%' , height: '32%' , fontSize: '1.3rem'}} onClick={HandleDepartment}>
        Manage Departments
      </Button>
    </Box>
    </div>
  );
}

export default Dashboard;