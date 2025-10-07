import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { setLoginState, setUser } = useContext(AuthContext);

  const changePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changePassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) alert(response.data.error);
        else {
          localStorage.removeItem("accessToken");
          setLoginState(false);
          setUser({});
          navigate("/");
        }
      });
  };
  return (
    <div className="change-password-ctn">
      <h2>Change Password</h2>
      <label htmlFor="oldPassword">Old Password</label>
      <input
        name="oldPassword"
        className="user-input"
        onChange={(event) => setOldPassword(event.target.value)}
      ></input>
      <label htmlFor="newPassword">New Password</label>
      <input
        name="newPassword"
        className="user-input"
        onChange={(event) => setNewPassword(event.target.value)}
      ></input>
      <button className="submit-btn" onClick={changePassword}>
        save change
      </button>
    </div>
  );
}

export default ChangePassword;
