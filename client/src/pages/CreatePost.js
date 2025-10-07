import { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.userId) {
      navigate("/login");
    }
  }, []);
  const { user } = useContext(AuthContext);

  const initialValues = {
    title: "",
    description: "",
  };
  const validationShema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
  });
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate("/");
      });
  };
  return (
    <>
      <div className="formik">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationShema}
        >
          <Form className="form-ctn">
            <label className="label" htmlFor="title">
              Title
            </label>
            <ErrorMessage className="error" name="title" component="span" />
            <Field
              className="title-input"
              id="title"
              name="title"
              placeholder="Ex.title"
            ></Field>

            <label className="label" htmlFor="description">
              Description
            </label>
            <ErrorMessage
              className="error"
              name="description"
              component="span"
            />
            <Field
              as="textarea"
              className="description-input"
              id="description"
              name="description"
              placeholder="Ex.description"
            ></Field>

            <button className="submit-btn" type="submit">
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
}

export default CreatePost;
