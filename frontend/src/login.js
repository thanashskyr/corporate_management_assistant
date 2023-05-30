import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import cmaLogo from "./cmaLogoNoBG.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [token, setToken]= useState('');
  const history = useHistory();

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleLogin = () => {
    const data = {
      username: username,
      password: password,
    };
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          alert("Invalid credentials. Check your username or password")
          throw new Error("Invalid credentials");
        }
      })
      .then((data) => {
        try {
          const receivedToken = data.token;
          localStorage.setItem("token", receivedToken);
          const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; //after 24 hours
          localStorage.setItem("expirationTime", expirationTime.toString());

          // setToken(receivedToken);

          const storedToken = localStorage.getItem("token");
          console.log("Token:", storedToken);
          console.log("Response:", data.message);
          if (data.token) {
            history.push("/dashboard");
          }
        } catch (error) {
          console.log("Unauthorised");
        }
      })
      .catch((error) => {
        console.error("Error1:", error);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box textAlign="center" sx={{ padding: "20px", bottom: "200px" }}>
        <img src={cmaLogo} alt="Logo" />
        <h1>Welcome to Corporation Management App</h1>
      </Box>

      <Box
        textAlign="center"
        sx={{ backgroundColor: "white", borderRadius: "10px", padding: "50px" }}
      >
        <h1>Login</h1>
        <Box mb={2}>
          <TextField
            label="Username"
            variant="filled"
            style={{ width: "300px", height: "55px" }}
            value={username}
            onChange={handleUsernameChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="password"
            label="Password"
            variant="filled"
            style={{ width: "300px", height: "55px" }}
            value={password}
            onChange={handlePasswordChange}
          />
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "120px", height: "55px" }}
            onClick={handleLogin}
          >
            Log in!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
