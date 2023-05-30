import React from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import NavigationBar from "./NavigationBar";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DepManagement from "./DepManagement";

const Departments = () => {
  const [DepData, setDepData] = useState([]);
  const [newDepAdded, setNewDepAdded] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [dataFromChild, setDataFromChild] = useState(null);
  const [managementExpand, setManagementExpand] = useState(true);

  // Is passed (as onData prop) to the child component
  // which sets the state of dataFromChild in the parrent component.
  // So data fetched from child component can be accessed from the parrent component.
  const handleDataFromChild = (data) => {
    // Handle the data received from the child component
    setDataFromChild(data);
  };

  // Is used to check if the child component (DepManagement) has been expanded
  // So it can re-arrange the Datagrid table
  const handleDepManagementExpand = (managementExpand) => {
    setManagementExpand(managementExpand);
  };

  // Used to re-render Datagrid when a new dep is submitted
  const handleNewDepAdded = () => {
    setNewDepAdded(!newDepAdded);
  };

  useEffect(() => {
    const fetchDepData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/dep", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + storedToken,
          },
        });

        if (response.status === 200) {
          const jsondata = await response.json();
          setDepData(jsondata);
        } else {
          throw new Error("Get departments failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDepData();
  }, [newDepAdded]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
  ];

  const empcolumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "sirname", headerName: "Sirname", width: 150 },
    { field: "vat", headerName: "VAT", width: 150 },
  ];

  const handleCloseEmployees = () => {
    setDataFromChild(null);
    setSelectedRow([]);
  };

  return (
    <div>
      <NavigationBar />
      <DepManagement
        onNewDepAdded={handleNewDepAdded}
        selectedRow={selectedRow}
        onData={handleDataFromChild}
        didExpand={handleDepManagementExpand}
      />
      {dataFromChild && (
        <Box position="relative" top={305} left={20} marginRight={5}>
          <Typography variant="h4">
            Employees working on{" "}
            {DepData.find((obj) => obj.id === dataFromChild[0].department_id)
              ?.name || ""}
          </Typography>
          <DataGrid
            rows={dataFromChild}
            columns={empcolumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 3 },
              },
            }}
            pageSizeOptions={[3]}
            sx={{
              backgroundColor: "white",
            }}
          />
          <Button
            variant="contained"
            onClick={handleCloseEmployees}
            sx={{ margin: "1%" }}
          >
            Close
          </Button>
        </Box>
      )}

      <Box position="relative" top={305} left={20} marginRight={5}>
        <DataGrid
          rows={DepData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10 , 15]}
          checkboxSelection
          sx={{
            top: managementExpand ? "20px" : "60px",
            left: "20",
            marginRight: "5",
            backgroundColor: "white",
          }}
          onRowSelectionModelChange={(newSelection) => {
            if (newSelection.length > 0) {
              const selectedDepRows = DepData.filter((obj) =>
                newSelection.includes(obj.id)
              );
              setSelectedRow(selectedDepRows);
              console.log(selectedRow);
            } else {
              setDataFromChild(null);
              setSelectedRow([]);
            }
          }}
        />
      </Box>
    </div>
  );
};

export default Departments;
