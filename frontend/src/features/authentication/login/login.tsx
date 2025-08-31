import "./login.css";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "../../../shared/config/api";
import { useState } from "react";

interface LoginFormData {
  identifier: string;
  password: string;
}

const validSchema = yup
  .object({
    identifier: yup
      .string()
      .trim()
      .transform((value) => value.toLowerCase())
      .required("Username or email is required"),
    password: yup.string().trim().required("Password is required"),
  })
  .required();

export const Login = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: yupResolver(validSchema) });

  const onsubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);
      setSuccessMessage(response.message || "Login Successful");

      localStorage.setItem("token", response.token);
      localStorage.setItem("username", JSON.stringify(response.user.username));
      localStorage.setItem("usertype", JSON.stringify(response.user.usertype));
      localStorage.setItem("userId", response.user.id);

      setTimeout(() => {
        setSuccessMessage("");
        if (response.user.usertype === "professional") {
          navigate("/profile");
        } else {
          navigate("/home");
        }
      }, 2000);
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Login Failed");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  return (
    <div className="container">
      <div className="left-container">
        <img src="/src/assets/authLeft.svg" />
      </div>

      <div className="right-container">
        <form className="login-container" onSubmit={handleSubmit(onsubmit)}>
          <h1>Login to Your Account</h1>

          {/* Username / Email */}
          <div className="input-group">
            <input
              {...register("identifier")}
              type="text"
              placeholder=" "
              className="form_input"
            />
            <label style={{ color: errors.identifier ? "#e74c3c" : "#999" }}>
              {errors.identifier
                ? errors.identifier.message
                : "Username or email"}
            </label>
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              {...register("password")}
              type="password"
              placeholder=" "
              className="form_input"
            />
            <label style={{ color: errors.password ? "#e74c3c" : "#999" }}>
              {errors.password ? errors.password.message : "Password"}
            </label>
          </div>

          {/* Login Button */}
          <button type="submit" className="register-button">
            Login
          </button>

          {/* Sign up link */}
          <span className="signup-text">
            Don't Have an Account?{" "}
            <span className="signup-link" onClick={() => navigate("/register")}>
              Sign Up here
            </span>
          </span>
        </form>
      </div>

      {(successMessage || errorMessage) && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>{successMessage || errorMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage("");
                setErrorMessage("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
