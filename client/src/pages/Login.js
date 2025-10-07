import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useEffect } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLoginState, setUser, user } = useContext(AuthContext);

  if (user.userId) {
    navigate("/");
  }

  const onSubmit = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data);
        setLoginState(true);
        setUser({});

        axios
          .get("http://localhost:3001/auth/check", {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            if (response.data.error) {
              console.log(response.data.error);
            } else {
              setUser({
                username: response.data.username,
                userId: response.data.id,
              });
              navigate("/");
            }
          });
      }
    });
  };

  return (
    <div className="formik">
      <div className="form-ctn">
        <label className="label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className="user-input"
          name="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></input>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          className="user-input"
          name="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
        <button className="submit-btn" type="submit" onClick={onSubmit}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
