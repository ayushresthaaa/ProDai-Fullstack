import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  updateUsernameAPI,
  updateEmailAPI,
  updatePasswordAPI,
  switchToProfessionalAPI,
  switchToUserAPI,
  getUserCredentials, // <-- import this
} from "../../shared/config/api";
import styles from "./changeCred.module.css";
import {
  type UpdateUsernameForm,
  type UpdateEmailForm,
  type UpdatePasswordForm,
  type SwitchUserTypeForm,
  updateUsernameSchema,
  updateEmailSchema,
  updatePasswordSchema,
  switchUserTypeSchema,
} from "./changeCred.schema";
import { Navbar } from "../../components/ui/navbar/Navbar";
import { ProfessionalNavbar } from "../../components/ui/navbar/ProNavbar";
import { Footer } from "../../components/ui/footer/Footer";
import { useNavigate } from "react-router-dom";

export const ChangeCred = () => {
  const [success, setSuccessMessage] = useState("");
  const [error, setErrorMessage] = useState("");
  const storedUsertype = localStorage.getItem("usertype");
  const usertype = storedUsertype ? JSON.parse(storedUsertype) : "user";

  // Forms
  const usernameForm = useForm<UpdateUsernameForm>({
    resolver: yupResolver(updateUsernameSchema),
  });
  const emailForm = useForm<UpdateEmailForm>({
    resolver: yupResolver(updateEmailSchema),
  });
  const passwordForm = useForm<UpdatePasswordForm>({
    resolver: yupResolver(updatePasswordSchema),
  });
  const usertypeForm = useForm<SwitchUserTypeForm>({
    resolver: yupResolver(switchUserTypeSchema),
  });

  // Fetch user credentials on mount and reset forms
  useEffect(() => {
    const fetchUserCredentials = async () => {
      try {
        const data = await getUserCredentials();
        usernameForm.reset({ username: data.username });
        emailForm.reset({ email: data.email });
        usertypeForm.reset({ usertype: data.usertype });
      } catch (err: unknown) {
        const error = err as { message: string };
        setErrorMessage(error.message || "Failed to fetch user data");
      }
    };
    fetchUserCredentials();
  }, []);

  // Handlers
  const onUpdateUsername = async (data: UpdateUsernameForm) => {
    try {
      const res = await updateUsernameAPI(data.username);
      setSuccessMessage(res.message);
      setErrorMessage("");
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to update username");
      setSuccessMessage("");
    }
  };

  const onUpdateEmail = async (data: UpdateEmailForm) => {
    try {
      const res = await updateEmailAPI(data.email);
      setSuccessMessage(res.message);
      setErrorMessage("");
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to update email");
      setSuccessMessage("");
    }
  };

  const onUpdatePassword = async (data: UpdatePasswordForm) => {
    try {
      const res = await updatePasswordAPI(data.oldPassword, data.newPassword);
      setSuccessMessage(res.message);
      setErrorMessage("");
      passwordForm.reset(); // Clear password fields
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to update password");
      setSuccessMessage("");
    }
  };

  const onSwitchUsertype = async (data: SwitchUserTypeForm) => {
    try {
      if (data.usertype === "professional") {
        const res = await switchToProfessionalAPI();
        setSuccessMessage(res.message);
      } else {
        const res = await switchToUserAPI();
        setSuccessMessage(res.message);
      }
      setErrorMessage("");
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to switch account type");
      setSuccessMessage("");
    }
  };
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <>
      {usertype === "professional" ? <ProfessionalNavbar /> : <Navbar />}
      <div className={styles.container}>
        <div className="back-btn" onClick={handleBackClick}>
          ← Back to Home
        </div>
        {/* <h1 className={styles.title} style={{ fontSize: "27px" }}>
          Profile Settings
        </h1> */}

        {/* Username Form */}
        <form
          onSubmit={usernameForm.handleSubmit(onUpdateUsername)}
          className={styles.section}
        >
          <h2>Change Username</h2>
          <div className={styles.inputGroup}>
            <input
              {...usernameForm.register("username")}
              type="text"
              placeholder=" "
              autoComplete="off"
              className={styles.formInput}
            />
            <label className={styles.formLabel}>Username</label>
            {usernameForm.formState.errors.username && (
              <p className={styles.errorMessage}>
                {usernameForm.formState.errors.username.message}
              </p>
            )}
          </div>
          <button type="submit" className={styles.button}>
            Update Username
          </button>
        </form>

        {/* Email Form */}
        <form
          onSubmit={emailForm.handleSubmit(onUpdateEmail)}
          className={styles.section}
        >
          <h2>Change Email</h2>
          <div className={styles.inputGroup}>
            <input
              {...emailForm.register("email")}
              type="email"
              placeholder=" "
              autoComplete="off"
              className={styles.formInput}
            />
            <label className={styles.formLabel}>Email</label>
            {emailForm.formState.errors.email && (
              <p className={styles.errorMessage}>
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <button type="submit" className={styles.button}>
            Update Email
          </button>
        </form>

        {/* Switch User Type */}
        <form
          onSubmit={usertypeForm.handleSubmit(onSwitchUsertype)}
          className={`${styles.section} ${styles.switchSection}`}
        >
          <h2>Switch Account Type</h2>
          <select
            {...usertypeForm.register("usertype")}
            className={styles.select}
          >
            <option value="user">User</option>
            <option value="professional">Professional</option>
          </select>
          {usertypeForm.formState.errors.usertype && (
            <p className={styles.errorMessage}>
              {usertypeForm.formState.errors.usertype.message}
            </p>
          )}
          <button type="submit" className={styles.button}>
            Switch
          </button>
        </form>

        {/* Password Form */}
        <form
          onSubmit={passwordForm.handleSubmit(onUpdatePassword)}
          className={styles.section}
        >
          <h2>Change Password</h2>
          <div className={styles.inputGroup}>
            <input
              {...passwordForm.register("oldPassword")}
              type="password"
              placeholder=" "
              className={styles.formInput}
              autoComplete="off"
            />
            <label className={styles.formLabel}>Old Password</label>
            {passwordForm.formState.errors.oldPassword && (
              <p className={styles.errorMessage}>
                {passwordForm.formState.errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              {...passwordForm.register("newPassword")}
              type="password"
              placeholder=" "
              className={styles.formInput}
              autoComplete="off"
            />
            <label className={styles.formLabel}>New Password</label>
            {passwordForm.formState.errors.newPassword && (
              <p className={styles.errorMessage}>
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              {...passwordForm.register("confirmNewPassword")}
              type="password"
              placeholder=" "
              className={styles.formInput}
              autoComplete="off"
            />
            <label className={styles.formLabel}>Confirm New Password</label>
            {passwordForm.formState.errors.confirmNewPassword && (
              <p className={styles.errorMessage}>
                {passwordForm.formState.errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button type="submit" className={styles.button}>
            Update Password
          </button>
        </form>

        {/* Modal */}
        {(success || error) && (
          <div className="modal-backdrop">
            <div className="modal">
              <p>{success || error}</p>
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
      <Footer />
    </>
  );
};
