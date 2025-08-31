import "./register.css";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser } from "../../../shared/config/api";
import { useState } from "react";

interface RegisterFormData {
  username: string;
  fullname: string;
  usertype: string;
  email_address: string;
  password: string;
  confirmPassword: string;
}

const validSchema = yup
  .object({
    username: yup
      .string()
      .trim()
      .transform((value) => value.toLowerCase())
      .required("Username is required")
      .max(30, "Username cannot exceed 30 characters"),
    fullname: yup
      .string()
      .trim()
      .required("Full name is required")
      .max(60, "Full name cannot exceed 60 characters"),
    usertype: yup.string().required("Select user type"),
    email_address: yup
      .string()
      .trim()
      .transform((value) => value.toLowerCase())
      .email("Invalid email")
      .required("Email is required"),
    password: yup
      .string()
      .trim()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password cannot exceed 30 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();

export const Register = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validSchema) });

  const onsubmit = async (data: RegisterFormData) => {
    try {
      const res = await registerUser(data);
      setSuccessMessage(res.message);

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 2000);
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message);

      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  return (
    <div className="container">
      <div className="left-container">
        <img src="/src/assets/register.svg" />
      </div>

      <div className="right-container">
        <form className="login-container" onSubmit={handleSubmit(onsubmit)}>
          <h1>Create Your Account</h1>

          {/* Username */}
          <div className="input-group">
            <input
              {...register("username")}
              type="text"
              placeholder=" "
              className="form_input"
            />
            <label style={{ color: errors.username ? "#e74c3c" : "#999" }}>
              {errors.username ? errors.username.message : "Username"}
            </label>
          </div>

          {/* Full Name */}
          <div className="input-group">
            <input
              {...register("fullname")}
              type="text"
              placeholder=" "
              className="form_input"
            />
            <label style={{ color: errors.fullname ? "#e74c3c" : "#999" }}>
              {errors.fullname ? errors.fullname.message : "Full Name"}
            </label>
          </div>

          {/* User Type */}
          <div className="input-group">
            <select
              {...register("usertype")}
              className="form_input"
              defaultValue=""
              style={{ color: errors.usertype ? "#e74c3c" : "#fff" }}
            >
              <option value="" disabled>
                Select user type
              </option>
              <option value="user">User</option>
              <option value="professional">Professional</option>
            </select>
            {errors.usertype && (
              <label style={{ color: "#e74c3c" }}>
                {errors.usertype.message}
              </label>
            )}
          </div>

          {/* Email */}
          <div className="input-group">
            <input
              {...register("email_address")}
              type="email"
              placeholder=" "
              className="form_input"
            />
            <label style={{ color: errors.email_address ? "#e74c3c" : "#999" }}>
              {errors.email_address ? errors.email_address.message : "Email"}
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

          {/* Confirm Password */}
          <div className="input-group">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder=" "
              className="form_input"
            />
            <label
              style={{ color: errors.confirmPassword ? "#e74c3c" : "#999" }}
            >
              {errors.confirmPassword
                ? errors.confirmPassword.message
                : "Confirm Password"}
            </label>
          </div>

          {/* Register Button */}
          <button type="submit" className="register-button">
            Register
          </button>

          {/* Login link */}
          <span className="signup-text">
            Already have an Account?{" "}
            <span className="signup-link" onClick={() => navigate("/")}>
              Login here
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
