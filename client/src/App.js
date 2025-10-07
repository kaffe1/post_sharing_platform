import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import ChangePassword from "./pages/ChangePassword";

import axios from "axios";
import { AuthContext } from "./helpers/AuthContext";

function App() {
  const [loginState, setLoginState] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  //change loginState
  useEffect(() => {
    console.log("useEffect executed");
    axios
      .get("http://localhost:3001/auth/check", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setLoginState(false);
        } else {
          setLoginState(true);
          console.log(response.data);
          setUser({
            username: response.data.username,
            userId: response.data.id,
          });
        }
      });
  }, []);
  const logout = () => {
    localStorage.removeItem("accessToken");
    setLoginState(false);
    setUser({});
    navigate("/login");
  };
  console.log("refreshed!");

  return (
    <div className="App">
      <AuthContext.Provider
        value={{ loginState, setLoginState, setUser, user }}
      >
        <nav className="nav">
          <div className="nav-link">
            {!loginState ? (
              <>
                <Link className="text-link" to="/registration">
                  Registration
                </Link>
                <Link className="text-link" to="/login">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link className="text-link" to="/">
                  Go Home
                </Link>
                <Link className="text-link" to="/create-post">
                  Create Post
                </Link>
                <button className="logout-btn" onClick={logout}>
                  Log out
                </button>
              </>
            )}
          </div>
          <div className="user-info">
            Hello! <span>{user.username}</span>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
