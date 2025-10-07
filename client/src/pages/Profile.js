import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [postList, setPostList] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/byUserId/${id}`).then((response) => {
      setUsername(response.data);
    });
    axios.get(`http://localhost:3001/posts/byUserId/${id}`).then((response) => {
      setPostList(response.data);
    });
  }, []);

  const postListEle = postList.map((item, index) => {
    return (
      <div className="post" key={index}>
        <div className="title">
          <span>{item.title}</span>
        </div>
        <div
          onClick={() => {
            navigate(`/post/${item.id}`);
          }}
          className="description"
        >
          {item.description}
        </div>
        <div className="user">{item.user}</div>
      </div>
    );
  });

  return (
    <div className="profile-page">
      <div className="basicInfo-ctn">
        <h1>Username:</h1>
        <h1>{username}</h1>
        {user.username == username && (
          <button
            className="change-password-btn"
            onClick={() => navigate("/changePassword")}
          >
            change password
          </button>
        )}
      </div>
      <div className="hr">
        ---------------((---------^--------^---------))---------------
      </div>
      <div className="postsList-ctn">{postListEle}</div>
    </div>
  );
}

export default Profile;
