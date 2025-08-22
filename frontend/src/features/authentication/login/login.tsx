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
      .required("username or email is required"),
    password: yup.string().trim().required("password is required"),
  })
  .required();
export const Login = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validSchema) });

  const onsubmit = async (data: LoginFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await loginUser(data);
      setSuccessMessage(response.message || "Login Successful");

      localStorage.setItem("token", response.token);
      localStorage.setItem("username", JSON.stringify(response.user.username));
      localStorage.setItem("usertype", JSON.stringify(response.user.usertype));
      localStorage.setItem("userId", response.user.id);
      setTimeout(() => {
        if (response.user.usertype === "professional") {
          navigate("/profile");
        } else {
          navigate("/home");
        }
      }, 2000);
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Login Failed");
    }
  };
  return (
    <>
      <div className="container">
        <div className="left-container">
          <img src="/src/assets/authLeft.svg" />
        </div>
        <div className="right-container">
          <h1>
            Welcome to Pro Dai where you can explore Tech Professionals you want
            to hire.
          </h1>
          <form className="login-container" onSubmit={handleSubmit(onsubmit)}>
            <h1>Login to Your Account</h1>
            <div className="input-group">
              <input
                {...register("identifier")}
                type="text"
                id="login-username"
                autoComplete="off"
                placeholder=" "
                className="form_input"
              />
              <label htmlFor="login-username">Username or email</label>
              {errors.identifier && (
                <p className="error-message">{errors.identifier.message}</p>
              )}
            </div>

            <div className="input-group">
              <input
                {...register("password")}
                type="password"
                id="login-password"
                autoComplete="off"
                placeholder=" "
                className="form_input"
              />
              <label htmlFor="login-password">Password</label>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>
            <button>Login</button>
            <span className="signup-link" onClick={() => navigate("/register")}>
              Sign Up here
            </span>
          </form>
        </div>
      </div>
      {(successMessage || errorMessage) && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>{successMessage || errorMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage(null);
                setErrorMessage(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
