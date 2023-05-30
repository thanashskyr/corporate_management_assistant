import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useHistory } from "react-router-dom";


const Management = ({ onNewDepAdded, selectedRow, onData, didExpand }) => {
  // onNewDepAdded is a function passed as prop from the parent component (Department.js)
  // which makes sure when a new Department is added to inform the parent component and run again
  // the fetch logic to update the Datagrid table with the new data

  // selectedRows is an array passed as prop from the parent component (Department.js)
  // which includes the data of the rows from the Datagrid component that have been selected.
  // This is used for the Update Delete and Show functionalities

  // onData is a callback function passed as prop from the parent component (Department.js)
  // which allows us to tranfer data from the child component to the parent component.
  // It is used so that we can Show the Employees that work in a specific component as a Datagrid table
  // that is rendered in the parrent component

  const [showAddDepartmentInput, setShowAddDepartmentInput] = useState(false);
  const [showUpdateDepartmentInput, setShowUpdateDepartmentInput] =
    useState(false);
  const [showDepartmentField, setShowDepartmentField] = useState(false);
  const [addDepValues, setAddDepValues] = useState({
    name: "",
  });
  const [UpdateDepValues, setUpdateDepValues] = useState({
    name: "",
  });

  const [deleteDisable, setDeleteDisable] = useState(true);
  const [showEmpDisable, setShowEmpDisable] = useState(true);

  useEffect(() => {
    // The bellow if blocks make sure that the
    // Delete Departments and Show Employees buttons
    // will be enabled only if the selected row numbers is correct
    // 0 rows: none
    // 1 row: both
    // >1 row only delete

    if (selectedRow.length > 0 && selectedRow.length < 2) {
      setShowEmpDisable(false);
      setDeleteDisable(false);
    } else if (selectedRow.length > 1) {
      setShowEmpDisable(true);
    } else {
      setShowEmpDisable(true);
      setDeleteDisable(true);
    }
  }, [selectedRow]);

  const history = useHistory();

  // Is called when the go back button is pressed and returns to Dashboard
  const HandleGoBack = () => {
    history.push("/Dashboard");
  };

  // Is called when the Delete Departments button is called
  // and deletes one or more departments
  const handleDeleteDep = async () => {
    alert("Department deleted!");

    for (let i = 0; i < selectedRow.length; i++) {
      const selectedID = selectedRow[i].id;

      try {
        const storedToken = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/dep/${selectedID}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + storedToken,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    onNewDepAdded();
    setDeleteDisable(true);
  };

  // Runs as soon as a user presses the Update Department button
  // and enables the Update Form bellow the buttons
  const handleUpdateDepClick = () => {
    if(!showAddDepartmentInput){
    onData(null);//close show employee if it is open  
    setShowUpdateDepartmentInput(!showUpdateDepartmentInput);
    didExpand(showUpdateDepartmentInput);
    }
  };

  // Fills the UpdateDepValues state array with the values that a user gives
  const handleUpdateDepValues = (event) => {
    const { name, value } = event.target;
    setUpdateDepValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Runs the update call and handles the various responses from the server
  const handleUpdateDepartment = async () => {
    const new_dep_data = {
      name: UpdateDepValues.name,
    };
    const id = selectedRow[0].id;
    console.log(id);
    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/dep/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedToken,
        },
        body: JSON.stringify(new_dep_data),
      });
      setShowUpdateDepartmentInput(!showUpdateDepartmentInput);

      if (response.status === 200) {
        setShowUpdateDepartmentInput(!showUpdateDepartmentInput);
        setUpdateDepValues({ name: "" }); // Clear Textfields when employee is added successfully
        onNewDepAdded();
        //const jsondata = await response.json();
        alert("Department updated successfully");
        //setEmpData(jsondata);
      } else if (response.status === 400) {
        setShowUpdateDepartmentInput(!showUpdateDepartmentInput);
        alert("Bad Request");
      } else if (response.status === 422) {
        setShowUpdateDepartmentInput(!showUpdateDepartmentInput);
        alert("Department already exists");
      } else {
        alert("Server Error: Department update failed");
        throw new Error("Update departments failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Runs as soon as a user presses the Add Department button
  // and enables the Add Form bellow the buttons
  const handleAddDepartmentClick = async () => {
    if(!showUpdateDepartmentInput){
    onData(null);  
    setShowAddDepartmentInput(!showAddDepartmentInput);
    didExpand(showAddDepartmentInput);
    }
  };
  // Fills the AddDepValues state array with the values that a user gives
  const handleAddDepValues = (event) => {
    const { name, value } = event.target;
    setAddDepValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Runs the add call and handles the various responses from the server
  const handleAddDepartment = async () => {
    const new_dep_data = {
      name: addDepValues.name,
    };

    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/dep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedToken,
        },
        body: JSON.stringify(new_dep_data),
      });
      setShowAddDepartmentInput(!showAddDepartmentInput);

      if (response.status === 200) {
        setShowAddDepartmentInput(!showAddDepartmentInput);
        setAddDepValues({ name: "" }); // Clear Textfields when employee is added successfully
        onNewDepAdded();
        //const jsondata = await response.json();
        alert("Department created successfully");
        //setEmpData(jsondata);
      } else if (response.status === 400) {
        setShowAddDepartmentInput(!showAddDepartmentInput);
        alert("Bad Request");
      } else if (response.status === 409) {
        setShowAddDepartmentInput(!showAddDepartmentInput);
        alert("Department already exists");
      } else {
        alert("Server Error: Department employee failed");
        throw new Error("get departments failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Run the show call, handle the responses
  // and call onData to send the data to the parrent component
  const handleShowDep = async () => {
    setShowDepartmentField(!showDepartmentField);
    const id = selectedRow[0].id;

    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/dep/${id}/emp`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + storedToken,
        },
      });
      setShowDepartmentField(!showDepartmentField);

      if (response.status === 200) {
        const jsonempdata = await response.json();
        console.log(jsonempdata);
        onData(jsonempdata); // Send data to Department.js
        setShowAddDepartmentInput(false);
        setShowUpdateDepartmentInput(false);
      } else if (response.status === 400) {
        alert("Something went wrong");
      } else if (response.status === 404) {
        alert("No employees wokring there yet!");
      } else {
        alert("Server Error: Department update failed");
        throw new Error("Update departments failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "fixed",
        top: "50px",
        left: 0,
        right: 0,
        overflow: "hidden",
        backgroundColor: "white",
        zIndex: 1,
      }}
    >
      <Typography variant="h4" sx={{ padding: "50px", zIndex: 1 }}>
        Manage Departments
      </Typography>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "white",
          backgroundColor: showAddDepartmentInput
            ? "rgba(255, 255, 255)"
            : "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" onClick={handleAddDepartmentClick}>
            Add Department
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateDepClick}
            disabled={showEmpDisable}
            sx={{ marginLeft: "10px" }}
          >
            Update Department
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteDep}
            disabled={deleteDisable}
            sx={{ marginLeft: "10px" }}
          >
            Delete Departments
          </Button>
          <Button
            variant="contained"
            onClick={handleShowDep}
            disabled={showEmpDisable}
            sx={{ marginLeft: "10px" }}
          >
            Show Employees
          </Button>
        </Box>
        <Button
          variant="contained"
          sx={{ marginRight: "10px" }}
          onClick={HandleGoBack}
        >
          Go Back
        </Button>
      </Toolbar>
      {showAddDepartmentInput && (
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "white",
            transition: "background-color 0.3s ease",
          }}
        >
          <TextField
            label="Name"
            sx={{ marginRight: "10px" }}
            name="name"
            value={addDepValues.name}
            onChange={handleAddDepValues}
          />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              sx={{ marginLeft: "10px" }}
              onClick={handleAddDepartment}
            >
              Submit
            </Button>
          </Box>
        </Toolbar>
      )}
      {showUpdateDepartmentInput && (
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "white",
            transition: "background-color 0.3s ease",
          }}
        >
          <TextField
            label="Name"
            sx={{ marginRight: "10px" }}
            name="name"
            value={UpdateDepValues.name}
            onChange={handleUpdateDepValues}
          />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              sx={{ marginLeft: "10px" }}
              onClick={handleUpdateDepartment}
            >
              Submit
            </Button>
          </Box>
        </Toolbar>
      )}
    </Box>
  );
};

export default Management;
