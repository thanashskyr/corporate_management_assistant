import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useHistory } from "react-router-dom";

const Management = ({onNewEmpAdded, selectedRow}) => {
  const [showAddEmployeeInput, setShowAddEmployeeInput] = useState(false);
  const [showSearch, setShowSearch]= useState(false);
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [addEmpValues, setAddEmpValues] = useState({
    name: "",
    sirname: "",
    vat: "",
  });
  const [searchValues, setSearchValues] = useState({
    name: "",
    sirname: ""
  });
  const [updateDisable, setUpdateDisable] = useState(true);
  const [deleteDisable, setDeleteDisable] = useState(true);
  const [searchDisable, setSearchDisable] = useState(true);

  useEffect(() => {
    //console.log(selectedRow);
    const getName= searchValues.name;
    const getSirname= searchValues.sirname;
    if (getName && getSirname){
        setSearchDisable(false);
      }else{
          setSearchDisable(true);
      }
      console.log(searchValues);



    if(selectedRow.length > 0 && selectedRow.length < 2){
        setUpdateDisable(false);
        setDeleteDisable(false);
    }else if (selectedRow.length > 1){
        setUpdateDisable(true); 
    }else{
        setUpdateDisable(true);
        setDeleteDisable(true); 
    }
  }, [selectedRow,searchValues]);

  const history = useHistory();

  const HandleGoBack = () => {
    history.push("/Dashboard");
  };


  const handleDeleteEmp = async () =>{
    alert("Employee will be deleted!");
    
    for (let i=0;  i< selectedRow.length; i++){
        const selectedID=selectedRow[i].id;
            
            try {
                    const storedToken = localStorage.getItem("token");
                    const response = await fetch(`http://localhost:3000/emp/${selectedID}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + storedToken,
                    },
                    });
                    console.log(response);
                    
                  
                } catch (error) {
                    console.error("Error:", error);
                }
    }    
    onNewEmpAdded();
    setDeleteDisable(true);
    setUpdateDisable(true);

  }

 const handleSearch = async () => {
    setShowSearch(!showSearch);

 }





  const handleAddEmployeeClick = async () => {
    setShowAddEmployeeInput(!showAddEmployeeInput);

    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/dep", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + storedToken,
        },
      });

      if (response.status === 200) {
        const all_departments = await response.json();
        setAllDepartments(all_departments);
      } else {
        throw new Error("Get Departments Failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDepartmentSelect = (event) => {
    const departmentId = parseInt(event.target.value);
    setSelectedDepartments([...selectedDepartments, departmentId]);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedDepartments([...selectedDepartments, departmentId]);
    } else {
      setSelectedDepartments(
        selectedDepartments.filter((dep) => dep !== departmentId)
      );
    }
  };

  const handleSearchValues = async (event) => {
    const { name, value } = event.target;
    await setSearchValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    };

  const handleGetEmp = async () => {
    const getName= searchValues.name;
    const getSirname= searchValues.sirname;
   
    try{
        const storedToken = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/emp/byName?name=${getName}&&sirname=${getSirname}`, {
        method: "GET",
        headers: {
          
          Authorization: "Bearer " + storedToken,
        },
        
      });
      if (response.status === 200) {
        const getEmp = await response.json();
       console.log(getEmp);
      } else {
        alert('employee not found');
        throw new Error("get employee failed");
        
      }
    } catch (error) {
      console.error("Error:", error);
    }
   
}





  const handleAddEmpValues = (event) => {
    const { name, value } = event.target;
    setAddEmpValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleAddEmployee = async () => {
    const new_emp_data = {
      name: addEmpValues.name,
      sirname: addEmpValues.sirname,
      vat: addEmpValues.vat,
      department_id: selectedDepartments,
    };

    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/emp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedToken,
        },
        body: JSON.stringify(new_emp_data),
      });
      setShowAddEmployeeInput(!showAddEmployeeInput);

      if (response.status === 200) {
        setShowAddEmployeeInput(!showAddEmployeeInput);
        setAddEmpValues({ name: "", sirname: "", vat: "" }); // Clear Textfields when employee is added successfully
        onNewEmpAdded();
        //const jsondata = await response.json();
        alert("Employee created successfully");
        //setEmpData(jsondata);
      } else if (response.status === 400) {
        setShowAddEmployeeInput(!showAddEmployeeInput);
        alert("Bad Request");
      } else if (response.status === 422) {
        setShowAddEmployeeInput(!showAddEmployeeInput);
        alert("Employee already exists");
      } else {
        alert("Server Error: Create employee failed");
        throw new Error("get employees failed");
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
        top: "170px",
        left: 0,
        right: 0,
        overflow: "hidden"
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "white",
          backgroundColor: showAddEmployeeInput
            ? "rgba(255, 255, 255)"
            : "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button onClick={handleAddEmployeeClick}>Add Employee</Button>
          <Button disabled = {updateDisable} >Update Employee Info</Button>
          <Button onClick={handleDeleteEmp} disabled = {deleteDisable} >Delete Employee</Button>
          <Button onClick={handleSearch}>Search Menu</Button>
        </Box>
        <Button sx={{ marginRight: "10px" }} onClick={HandleGoBack}>
          Go Back
        </Button>
      </Toolbar>
      {showAddEmployeeInput && (
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
            value={addEmpValues.name}
            onChange={handleAddEmpValues}
          />
          <TextField
            label="SirName"
            sx={{ marginRight: "10px" }}
            name="sirname"
            value={addEmpValues.sirname}
            onChange={handleAddEmpValues}
          />
          <TextField
            label="VAT"
            sx={{ marginRight: "10px" }}
            name="vat"
            value={addEmpValues.vat}
            onChange={handleAddEmpValues}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              select
              label="Select Department(s)"
              sx={{ minWidth: "200px" }}
            >
              {allDepartments.map((department) => (
                <MenuItem key={department.id} value={department.name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedDepartments.includes(department.id)}
                        onChange={handleDepartmentSelect}
                        value={department.id}
                      />
                    }
                    label={department.name}
                  />
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              sx={{ marginLeft: "10px" }}
              onClick={handleAddEmployee}
            >
              Submit
            </Button>
          </Box>
        </Toolbar>
      )}
      
      {showSearch && (
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
            value={searchValues.name}
            onChange={handleSearchValues}
          />
          <TextField
            label="SirName"
            sx={{ marginRight: "10px" }}
            name="sirname"
            value={searchValues.sirname}
            onChange={handleSearchValues}
          />
          <TextField
            label="VAT"
            sx={{ marginRight: "10px" }}
            name="vat"
            value={searchValues.vat}
            onChange={handleSearchValues}
          />
           <Button
              variant="contained"
              sx={{ marginLeft: "10px" }}
              disabled = {searchDisable}
              onClick={handleGetEmp}
            >
              Search
            </Button>
         
        </Toolbar>  
        )}

    </Box>
  );
};

export default Management;
