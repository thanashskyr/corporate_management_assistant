import React from "react";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavigationBar from "./NavigationBar";
import Management from "./Management";
import { useHistory } from "react-router-dom";
import "./theme.css";


const Employees = () => {
  const [empData, setEmpData] = useState([]);
  const [newEmpAdded, setNewEmpAdded] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [specificId, setSpecificId] = useState(0);//takes the value of the searchId generated on child Management.js
  
 
  const [managementExpand, setManagementExpand] = useState(true);





  const handleEmpManagementExpand = (managementExpand) => {
    setManagementExpand(managementExpand);
  };
  // Used to re-render Datagrid when a new emp is submitted 
  const handleNewEmpAdded = () => {
    setNewEmpAdded(!newEmpAdded);
  };

  const history = useHistory();

 
 
  let rows = [...empData]; 
  //if specific id == 0 there wasnt a search so don't change the datagrid
  if (specificId > 0){
    // Find the index of the row with the specific Id
    const specificRowIndex = rows.findIndex((row) => row.id === specificId);
      //Move the row with the specific ID to the beginning of the array
      if (specificRowIndex !== -1) {
      const specificRow = rows.splice(specificRowIndex, 1);
        rows.unshift(specificRow[0]);
      }
  }else{
    rows = empData;
  }




  useEffect(() => {
    const fetchEmpData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/emp", {
          method: "get",
          headers: {
            Authorization: "Bearer " + storedToken,
          },
        });

        if (response.status === 200) {
          const jsondata = await response.json();
          setEmpData(jsondata);
        } else {
          throw new Error("get employees failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEmpData();
  }, [newEmpAdded]); // Re render when newEmpAdded state change





  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "sirname", headerName: "Sirname", width: 150 },
    { field: "vat", headerName: "VAT", width: 150 },
    { field: "departments", headerName: "Departments", width: 600 },
  ];

  return (
    <Box sx={{ position: 'relative' , }}>
      <NavigationBar />
      <Box sx={{ position: 'relative', height:"300px"}}>
      <Management onNewEmpAdded={handleNewEmpAdded} selectedRow={selectedRow} setSpecificId={setSpecificId} didExpand={handleEmpManagementExpand}/>

      <Box
        position="relative" top={305} left={20} marginRight={5}
      >
        <DataGrid
          key={newEmpAdded}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[ 10, 20 ]}
          checkboxSelection
          sx={{
            top: managementExpand ? "20px" : "60px",
            left: "20",
            marginRight: "5",
            backgroundColor: "white",
          }}
          onRowSelectionModelChange={(newSelection) => {
            console.log(newSelection);
            if (newSelection.length > 0) {
              const selectedEmpRows = empData.filter((obj) => newSelection.includes(obj.id));
              console.log(selectedEmpRows);
              setSelectedRow(selectedEmpRows);
            } else {
              setSelectedRow([]);
            }
          }}
        />
      </Box>
      </Box>
      </Box>
  );
};

export default Employees;
