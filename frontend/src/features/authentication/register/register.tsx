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
      .trim() // remove spaces
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
            <label>Username</label>
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="input-group">
            <input
              {...register("fullname")}
              type="text"
              placeholder=" "
              className="form_input"
            />
            <label>Full Name</label>
            {errors.fullname && (
              <p className="error-message">{errors.fullname.message}</p>
            )}
          </div>

          {/* User Type */}
          <div className="input-group">
            <select
              {...register("usertype")}
              className="form_input"
              defaultValue=""
            >
              <option value="" disabled>
                Select user type
              </option>
              <option value="user">User</option>
              <option value="professional">Professional</option>
            </select>
            {errors.usertype && (
              <p className="error-message">{errors.usertype.message}</p>
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
            <label>Email</label>
            {errors.email_address && (
              <p className="error-message">{errors.email_address.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              {...register("password")}
              type="password"
              placeholder=" "
              className="form_input"
            />
            <label>Password</label>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder=" "
              className="form_input"
            />
            <label>Confirm Password</label>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit">Register</button>
          <span className="signup-link" onClick={() => navigate("/")}>
            Already have an account? Login here
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
