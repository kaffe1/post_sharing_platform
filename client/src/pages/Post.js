import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from "react-router-dom";

function Post() {
  const [postObject, setPostObject] = useState({});
  const [newComments, setNewComments] = useState("");
  const [comments, setComments] = useState([]);
  const [btnEnterStatus, setBtnEnterStatus] = useState({});
  const navigate = useNavigate();
  let { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/ById/${id}`).then((response) => {
      setPostObject(response.data);
    });
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  console.log(comments);
  const { title, description, user } = postObject;

  //comments
  const deleteComment = (event) => {
    const commentId = event.target.id;
    axios
      .delete(`http://localhost:3001/comments/${commentId}/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("no logged in");
        } else {
          setComments(response.data);
        }
        // console.log("Comment deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };

  const addComments = () => {
    axios
      .post(
        `http://localhost:3001/comments`,
        {
          CommentBody: newComments,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          //   alert(response.data.error);
          console.log("no logged in");
        } else {
          if (newComments) setComments((pre) => [...pre, response.data]);
          //   console.log("attention!");
          //   console.log(comments);
          setNewComments("");
        }
      });
  };
  const mouseEnterHandler = (commentId) => {
    console.log("entered");
    console.log(btnEnterStatus);
    setBtnEnterStatus((pre) => ({ ...pre, [commentId]: true }));
  };
  const mouseLeaveHandler = (commentId) => {
    console.log("left");
    console.log(btnEnterStatus);
    setBtnEnterStatus((pre) => ({ ...pre, [commentId]: false }));
  };
  const deletePost = () => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.log("no logged in");
        } else if (response.data.status) {
          navigate("/");
        }
        // console.log("Comment deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };
  const edit = (option) => {
    if (option == "title") {
      const newTitle = prompt("update your post title:");
      axios.put(
        "http://localhost:3001/posts/title",
        { id: id, newTitle: newTitle },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject((pre) => {
        return { ...pre, title: newTitle };
      });
    } else {
      const newBody = prompt("update your post description:");
      axios.put(
        "http://localhost:3001/posts/body",
        { id: id, newBody: newBody },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject((pre) => {
        return { ...pre, description: newBody };
      });
    }
  };
  const commentsEle = comments.map((comment, index) => {
    return (
      <div
        key={index}
        className="comment"
        onMouseEnter={() => mouseEnterHandler(comment.id)}
        onMouseLeave={() => mouseLeaveHandler(comment.id)}
      >
        <span>"{comment.CommentBody}"</span>
        <span className="comment-user">--{comment.username}</span>
        {currentUser.username == comment.username &&
          btnEnterStatus[comment.id] && (
            <button className="del-btn" id={comment.id} onClick={deleteComment}>
              ✕
            </button>
          )}
      </div>
    );
  });
  return (
    <div className="post-page">
      <div className="post-detail post">
        <div
          className="title title-detail"
          onClick={() => {
            if (currentUser.username == postObject.user) edit("title");
          }}
        >
          {title}
        </div>
        <div
          className="description description-detail"
          onClick={() => {
            if (currentUser.username == postObject.user) edit("description");
          }}
        >
          {description}
        </div>
        <div className="user user-detail">
          {user}
          {currentUser.username == postObject.user ? (
            <button onClick={deletePost}>delete</button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="comments-ctn">
        <div className="creat-comments">
          <textarea
            type="text"
            placeholder="comments..."
            value={newComments}
            onChange={(event) => {
              setNewComments(event.target.value);
            }}
          />
          <button className="add-comments" onClick={addComments}>
            Add Comments
          </button>
        </div>
        <div className="comments">{commentsEle}</div>
      </div>
    </div>
  );
}

export default Post;
