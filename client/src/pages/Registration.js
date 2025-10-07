import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(() => {
      console.log("registered !");
      navigate("/login");
    });
  };

  const validationShema = Yup.object().shape({
    username: Yup.string().min(5).max(20).required(),
    password: Yup.string().min(5).max(20).required(),
  });
  return (
    <>
      <div className="formik">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationShema}
        >
          <Form className="form-ctn">
            <label className="label" htmlFor="username">
              Username
            </label>
            <ErrorMessage className="error" name="username" component="span" />
            <Field
              className="user-input"
              id="username"
              name="username"
              placeholder="Ex.user"
            ></Field>

            <label className="label" htmlFor="password">
              Password
            </label>
            <ErrorMessage className="error" name="password" component="span" />
            <Field
              className="user-input"
              id="password"
              name="password"
              placeholder="your password"
            ></Field>

            <button className="submit-btn" type="submit">
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
}

export default Registration;
