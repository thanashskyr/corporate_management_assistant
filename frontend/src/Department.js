import React from 'react';
import { Box, Button, Typography, TextField} from '@mui/material';
import NavigationBar from './NavigationBar';
import { useHistory } from 'react-router-dom';
import { useState , useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";

const useHandleNewDepartment = () => {
  const [showInput, setShowInput] = useState(false);
  const HandleNewDepartment = () => {
    if (showInput === false) {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
    console.log("new employee");
  };
  return { HandleNewDepartment, showInput };
};
  


const Departments = () =>  {


  const history = useHistory();    
    
  const HandleGoBack = () => {
      history.push("/Dashboard");
  }

  const [DepData, setDepData] = useState([]);

  useEffect(() => {
    const fetchDepData = async () => {
        try{
            const storedToken = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/dep', {
                method: 'get',
                headers: {
              'Authorization': 'Bearer ' + storedToken
            }
            });
        
            if (response.status === 200) {
              const jsondata = await response.json();
              setDepData(jsondata);
              
            } else {
              throw new Error('Get departments failed');
            }
          
        } catch (error) {
          console.error('Error:', error);
        }
    };

    fetchDepData();

}, []);

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 150 },
];
const { HandleNewDepartment, showInput } = useHandleNewDepartment();

  return (
    <div>
     <NavigationBar />
     <Box position='fixed' sx={{  top: 64,right:0, left:0,backgroundColor: 'white', padding: '30px',zIndex: 1}}>
      <Typography variant="h4" component="h2" sx={{  marginLeft:'10px'}}>
        Manage Departments
      </Typography>
      </Box>
      <Box       position="fixed"
        top={80}
        left={0}
        right={0}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        height="15vh"
        sx={{
        backgroundColor: '#0E5D94',
        zIndex: 1 , marginTop: '80px'}}
        >
      <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={HandleNewDepartment}
      >
      New Department
      </Button>
      {showInput && (
      <div>
      <TextField
          label="Name"
          InputLabelProps={{
            style: { transform: 'translate(3px , 1.5px) scale(0.95)' },
          }}
          variant="outlined"
          size="small"
          sx={{
            width: '92%',
            '& .MuiInputBase-input': {
              fontSize: '0.8rem',
              padding: '4px 8px',
              background: '#70B3E1'
            },
          }}
          onChange={(e) => console.log(e.target.value)}
      />  
        <Button  variant="contained"
          size="small"
          color="primary">
              submit new department
             </Button>
          </div>
        )}
 

      <Button
          variant="contained"
          size="large"
          color="primary"
          style={{ marginLeft: "20px" }}
        >
          Update
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          style={{ marginLeft: "20px" }}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          style={{ marginLeft: "20px", marginRight: '1315px' }}
        >
          Search
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{
            position: "fixed",
            right: 20,
            backgroundColor: "primary",
            display: "flex",
            justifyContent: "flex-end"
          }}
          onClick={HandleGoBack}
        >
          Go back
        </Button>
      </Box>
      <Box position="relative" top={305} left={0} right={0}>
        <DataGrid
        rows={DepData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        
      />
      </Box>
    </div>
    
  );
}

export default Departments;