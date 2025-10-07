import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [postList, setPostList] = useState([]);
  let src = "";
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios.get("http://localhost:3001/posts").then((response) => {
        setPostList(response.data);
      });
    }
  }, []);

  const likePost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { postId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          return console.log(res.data.error);
        }
        setPostList(res.data.postList);
        // once I tried to change the likes array with random number to track the like numbers

        // const newPost = postList.find((post) => post.id === postId);
        // const updatedPost = {
        //   ...newPost,
        //   Likes: res.data.like
        //     ? [...newPost.Likes, 1]
        //     : newPost.Likes.slice(0, -1),
        // };
        // setPostList(
        //   postList.map((post) => {
        //     if (post.id !== postId) {
        //       return post;
        //     } else {
        //       return updatedPost;
        //     }
        //   })
        // );
      });
  };
  console.log(postList);
  const postListEle = postList.map((item, index) => {
    const isLiked1 = item.Likes.find(
      (likeObj) => likeObj.UserId == user.userId
    );
    // const isLiked2 = item.Likes.find((likeObj) => likeObj == 1);
    src = isLiked1 ? "/imgs/fill-heart.png" : "/imgs/empty-heart.png";
    return (
      <div className="post" key={index}>
        <div className="title">
          <span>{item.title}</span>
          <div className="like-section">
            <span className="like-number">{item.Likes.length}</span>
            <div onClick={() => likePost(item.id)} className="like-btn">
              <img
                style={{ cursor: "pointer" }}
                className="like-img"
                src={src}
              />
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            navigate(`/post/${item.id}`);
          }}
          className="description"
        >
          {item.description}
        </div>
        <div className="user">
          <Link className="clickable-name" to={`/profile/${item.UserId}`}>
            {item.user}
          </Link>
        </div>
      </div>
    );
  });

  return <div className="posts-ctn">{postListEle}</div>;
}

export default Home;
