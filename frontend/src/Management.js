import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material"; 

const Management = ({onNewEmpAdded, selectedRow , setSpecificId , didExpand}) => {
  //show extra textfields onClick useState handlers 
  const [showAddEmployeeInput, setShowAddEmployeeInput] = useState(false);
  const [showSearch, setShowSearch]= useState(false);
  const [showEmpUpdate, setShowEmpUpdate] = useState(false);

  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
 
  //set the values will be given from the textfields as inputs
  const [addEmpValues, setAddEmpValues] = useState({
    name: "",
    sirname: "",
    vat: "",
  });


  const [updateEmpValues, setUpdateEmpValues] = useState({
   name:"",
   sirname:"",
   vat:""
  }); 

  const [searchValues, setSearchValues] = useState({
    name: "",
    sirname: ""
  });
  
  //enable and disable buttons update and delete
  const [updateDisable, setUpdateDisable] = useState(true);
  const [deleteDisable, setDeleteDisable] = useState(true);

  const [searchNameDisable, setSearchNameDisable] = useState(true);
  const [searchVatDisable, setSearchVatDisable] = useState(true);



  useEffect(() => {
    const getName= searchValues.name;
    const getSirname= searchValues.sirname;
    const getVat= searchValues.vat;
    if (getName && getSirname){
        setSearchNameDisable(false);
      }else{
          setSearchNameDisable(true);
      }

      if (getVat){
        setSearchVatDisable(false);
      }else{
          setSearchVatDisable(true);
      }


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
    alert("Employee deleted!");
   
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
  if (!showEmpUpdate&&!showAddEmployeeInput){
    didExpand(showSearch);
    setShowSearch(!showSearch);
  }
 }





  const handleAddEmployeeClick = async () => {
    if (!showEmpUpdate&&!showSearch){
    didExpand(showAddEmployeeInput);
    setShowAddEmployeeInput(!showAddEmployeeInput);
    }
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

  const handleUpdateEmployeeClick = async () => {
    setUpdateEmpValues({
      name: selectedRow[0].name,
      sirname: selectedRow[0].sirname,
      vat: selectedRow[0].vat,
      department_id: selectedRow[0].departments
     })
 
    if (!showAddEmployeeInput&&!showSearch){
    setShowEmpUpdate(!showEmpUpdate);
    didExpand(showEmpUpdate);
    }

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

  





  const handleSearchValues = async (event) => {
    const { name, value } = event.target;
    await setSearchValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    };

  const handleGetEmpName= async () => {
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
        setSpecificId(getEmp.employee.id);
       
      } else {
        setSpecificId(0);
        alert('Employee not found!');
        throw new Error("get employee failed");
        
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
const handleGetEmpVat = async () =>{
  const getVat=searchValues.vat;
    try{
        const storedToken = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/emp/byVat?vat=${getVat}`, {
        method: "GET",
        headers: {
          
          Authorization: "Bearer " + storedToken,
        },
        
      });
      if (response.status === 200) {
        const getEmp = await response.json();
        setSpecificId(getEmp.employee.id);
       
      } else {
        setSpecificId(0);
        alert('Employee not found!');
        throw new Error("get employee failed");
        
      }
    } catch (error) {
      console.error("Error:", error);
    }

}
   

  const handleUpdateEmpValues = (event) => {
   
    const { name, value } = event.target;
    setUpdateEmpValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };


  const handleUpdateEmployee = async () => {
    const update_data = {
      name: updateEmpValues.name,
      sirname: updateEmpValues.sirname,
      vat: updateEmpValues.vat,
      department_id: selectedDepartments
    };
     console.log(update_data);
     const selectedID=selectedRow[0].id;
    if (update_data.name&&update_data.sirname&&update_data.vat&&update_data.department_id){

      try{
        const storedToken = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/emp/${selectedID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedToken,
          },
          body: JSON.stringify(update_data),
        });
        setShowEmpUpdate(!showEmpUpdate);
        
        if (response.status === 200) {
          setShowEmpUpdate(!showEmpUpdate);
          setUpdateDisable(!updateDisable);
          setDeleteDisable(!deleteDisable);
          setUpdateEmpValues({ name: "", sirname: "", vat: "" }); // Clear Textfields when employee is added successfully
          onNewEmpAdded();
          alert("Employee Updated successfully");
        } else if (response.status === 400) {
          setShowEmpUpdate(!showEmpUpdate);
          setUpdateDisable(!updateDisable);
          alert("Bad Request");
        } else {
          alert("Server Error: Update employee failed");
          throw new Error("Update employe failed");
        }

      }catch(error) {
        console.error("Error:", error);
      }
    }else{
      alert("All the fields must have a value");
    }
  };

  







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
      didExpand(!showAddEmployeeInput);
      setSelectedDepartments([]);
      
      if (response.status === 200) {
        setShowAddEmployeeInput(!showAddEmployeeInput);
        setAddEmpValues({ name: "", sirname: "", vat: "" }); // Clear Textfields when employee is added successfully
        onNewEmpAdded();
        
        alert("Employee created successfully");
     
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
        top: "50px",
        left: 0,
        right: 0,
        overflow: "hidden",
        backgroundColor: "white",
        zIndex:1
      }}
    >
       <Typography variant="h4" sx={{ padding: "50px", zIndex: 1 }}>
        Manage Employees
      </Typography>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: showAddEmployeeInput
            ? "rgba(255, 255, 255)"
            : "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" onClick={handleAddEmployeeClick} sx={{ marginLeft: "10px" }} >Add Employee</Button>
          <Button variant="contained" onClick={handleUpdateEmployeeClick} disabled={updateDisable} sx={{ marginLeft: "10px" }} >Update Employee Info</Button>
          <Button variant="contained" onClick={handleDeleteEmp} disabled = {deleteDisable} sx={{ marginLeft: "10px" }} >Delete Employee</Button>
          <Button variant="contained" onClick={handleSearch} sx={{ marginLeft: "10px" }} >Search Menu</Button>
        </Box>
        <Button sx={{ marginRight: "10px" }} variant="contained" onClick={HandleGoBack}>
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
      

      {showEmpUpdate && (
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
            value={updateEmpValues.name}
            onChange={handleUpdateEmpValues}
          />
          <TextField
            label="SirName"
            sx={{ marginRight: "10px" }}
            name="sirname"
            value={updateEmpValues.sirname}
            onChange={handleUpdateEmpValues}
          />
          <TextField
            label="VAT"
            sx={{ marginRight: "10px" }}
            name="vat"
            value={updateEmpValues.vat}
            onChange={handleUpdateEmpValues}
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
                      checked={
                        selectedDepartments.includes(department.id) //checks the new departments clicked now
                        //||updateEmpValues.department_id.includes(department.name)//checks the departments already employee belong to
                      }
                      
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
              onClick={handleUpdateEmployee}
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
          <Button
          variant="contained"
          sx={{ marginLeft: "10px" }}
          disabled = {searchNameDisable}
          onClick={handleGetEmpName}
        >
          Search by Name
        </Button>
          
          <TextField
            label="VAT"
            sx={{ marginRight: "10px", marginLeft:"10px" }}
            name="vat"
            value={searchValues.vat}
            onChange={handleSearchValues}
          />
           <Button
              variant="contained"
              sx={{ marginLeft: "10px" }}
              disabled = {searchVatDisable}
              onClick={handleGetEmpVat}
            >
              Search by Vat
            </Button>
         
        </Toolbar>  
        )}
    </Box>
  );
};

export default Management;
