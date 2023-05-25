import React from "react";
import { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavigationBar from "./NavigationBar";
import Management from "./Management";
import { useHistory } from "react-router-dom";
import "./theme.css";

const Employees = () => {
  const [empData, setEmpData] = useState([]);
  const [newEmpAdded, setNewEmpAdded] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);

  // Used to re-render Datagrid when a new emp is submitted 
  const handleNewEmpAdded = () => {
    setNewEmpAdded(!newEmpAdded);
  };

  const history = useHistory();

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
      <Management onNewEmpAdded={handleNewEmpAdded} selectedRow={selectedRow}/>

      <Box
        sx={{
          position: "absolute",
          top: "100%",
          left: 20,
          right: 20,
          marginTop: "20px", // Adjust the margin as needed
        }}
      >
        <DataGrid
          key={newEmpAdded}
          rows={empData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
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
